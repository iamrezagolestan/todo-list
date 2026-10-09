import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { db } from "../lib/db";
import { isRecord } from "../lib/tasks";

async function scenario(name: string, run: () => Promise<void>) {
  await run();
  console.info(`Passed: ${name}`);
}
const baseUrl = process.env.TASK_TEST_URL ?? "http://localhost:3100";
async function request(path: string, cookie: string, method = "GET", body?: unknown) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { Cookie: cookie, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data: unknown = await response.json();
  return { status: response.status, data };
}

test("task API: independent days, ownership, nested parents and cascade deletion", async () => {
  const users: string[] = [];
  const cookies: string[] = [];
  try {
    for (let index = 0; index < 2; index++) {
      const result = await db.query<{ id: string }>(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
        [`tasks-test-${randomUUID()}@example.invalid`, "integration-test-only"],
      );
      users.push(result.rows[0].id);
      const session = randomUUID();
      await db.query(
        "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, NOW() + interval '1 hour')",
        [session, result.rows[0].id],
      );
      cookies.push(`session_id=${session}`);
    }
    async function create(
      title: string,
      isParent: boolean,
      parentId: string | null = null,
      days = [0, 1],
    ) {
      const result = await request("/api/tasks", cookies[0], "POST", {
        title,
        is_parent: isParent,
        parent_id: parentId,
        days,
      });
      assert.equal(result.status, 201);
      assert.ok(isRecord(result.data));
      assert.equal(typeof result.data.id, "string");
      return String(result.data.id);
    }
    async function done(id: string, day: number, value: boolean) {
      assert.equal(
        (await request("/api/tasks", cookies[0], "PATCH", { id, day, is_done: value })).status,
        200,
      );
    }
    async function storedDone(id: string) {
      const result = await db.query<{ is_done: boolean }>(
        "SELECT is_done FROM tasks WHERE id = $1",
        [id],
      );
      return result.rows[0].is_done;
    }
    const root = await create("root", true);
    const nested = await create("nested", true, root);
    const leaf = await create("two-day child", false, nested);
    const sibling = await create("sibling", false, root, [0]);
    const standalone = await create("standalone", false, null, [2]);
    await scenario(
      "requires authentication and validates bodies and query parameters",
      async () => {
        assert.equal((await request("/api/tasks", "")).status, 401);
        for (const query of [
          "day=7",
          "day=invalid",
          "page=-1",
          "mode=unknown",
          "mode=children&parentId=0",
        ]) {
          assert.equal((await request(`/api/tasks?${query}`, cookies[0])).status, 400);
        }
        for (const body of [
          null,
          { title: "bad", days: [] },
          { title: "bad", days: [null] },
          { title: "bad", days: [7] },
          { title: "x".repeat(151), days: [0] },
          { title: "bad", days: [0], is_parent: "true" },
        ]) {
          assert.equal((await request("/api/tasks", cookies[0], "POST", body)).status, 400);
        }
      },
    );
    await scenario("filters by owner and weekday and prevents cross-user writes", async () => {
      const result = await request("/api/tasks?day=2", cookies[0]);
      assert.ok(isRecord(result.data) && Array.isArray(result.data.tasks));
      assert.deepEqual(
        result.data.tasks.map((task) => task.id),
        [standalone],
      );
      const foreign = await request(`/api/tasks?mode=children&parentId=${root}`, cookies[1]);
      assert.ok(isRecord(foreign.data));
      assert.deepEqual(foreign.data.tasks, []);
      assert.equal((await request("/api/tasks", cookies[1], "DELETE", { id: root })).status, 404);
      assert.equal(
        (await request("/api/tasks", cookies[1], "PATCH", { id: leaf, day: 0, is_done: true }))
          .status,
        404,
      );
      assert.equal(
        (
          await request("/api/tasks", cookies[1], "POST", {
            title: "foreign child",
            days: [0],
            parent_id: root,
          })
        ).status,
        400,
      );
      assert.equal(
        (await request("/api/tasks", cookies[0], "PATCH", { id: leaf, day: 6, is_done: true }))
          .status,
        400,
      );
    });
    await scenario(
      "Saturday completion leaves Sunday untouched and persists across reads",
      async () => {
        await done(leaf, 0, true);
        const result = await request(`/api/tasks?mode=children&parentId=${nested}`, cookies[0]);
        assert.ok(isRecord(result.data) && Array.isArray(result.data.tasks));
        assert.deepEqual(result.data.tasks[0].completed_days, [0]);
        assert.equal(await storedDone(leaf), false);
        assert.equal(await storedDone(nested), false);
        await done(leaf, 1, true);
        assert.equal(await storedDone(nested), true);
        assert.equal(await storedDone(root), false);
      },
    );
    await scenario(
      "parents are automatic; concurrent child updates and unticking propagate",
      async () => {
        assert.equal(
          (await request("/api/tasks", cookies[0], "PATCH", { id: root, day: 0, is_done: true }))
            .status,
          409,
        );
        await done(sibling, 0, true);
        assert.equal(await storedDone(root), true);
        await Promise.all([done(leaf, 1, false), done(sibling, 0, false)]);
        assert.equal(await storedDone(nested), false);
        assert.equal(await storedDone(root), false);
        await Promise.all([done(leaf, 1, true), done(sibling, 0, true)]);
        assert.equal(await storedDone(root), true);
        const added = await create("new incomplete child", false, root, [0]);
        assert.equal(await storedDone(root), false);
        assert.equal(
          (await request("/api/tasks", cookies[0], "DELETE", { id: added })).status,
          200,
        );
        assert.equal(await storedDone(root), true);
      },
    );
    await scenario(
      "only root parents appear initially; branches load their direct children",
      async () => {
        const parents = await request("/api/tasks?mode=parents", cookies[0]);
        assert.ok(isRecord(parents.data) && Array.isArray(parents.data.tasks));
        assert.deepEqual(
          parents.data.tasks.map((task) => task.id),
          [root],
        );
        const children = await request(`/api/tasks?mode=children&parentId=${root}`, cookies[0]);
        assert.ok(isRecord(children.data) && Array.isArray(children.data.tasks));
        assert.deepEqual(
          new Set(children.data.tasks.map((task) => task.id)),
          new Set([nested, sibling]),
        );
      },
    );
    await scenario(
      "deleting a parent removes all descendants and their completion rows",
      async () => {
        assert.equal((await request("/api/tasks", cookies[0], "DELETE", { id: root })).status, 200);
        const result = await db.query<{ count: string }>(
          "SELECT count(*) FROM tasks WHERE id = ANY($1::bigint[])",
          [[root, nested, leaf, sibling]],
        );
        assert.equal(result.rows[0].count, "0");
        const completions = await db.query<{ count: string }>(
          "SELECT count(*) FROM task_completions WHERE task_id = ANY($1::bigint[])",
          [[leaf, sibling]],
        );
        assert.equal(completions.rows[0].count, "0");
        assert.equal(await storedDone(standalone), false);
      },
    );
    await scenario("collections have deterministic bounded pagination", async () => {
      await db.query(
        "INSERT INTO tasks (title, user_id, days) SELECT 'page task ' || n, $1, ARRAY[6] FROM generate_series(1, 51) n",
        [users[0]],
      );
      const first = await request("/api/tasks?day=6", cookies[0]);
      const second = await request("/api/tasks?day=6&page=1", cookies[0]);
      assert.ok(isRecord(first.data) && Array.isArray(first.data.tasks));
      assert.ok(isRecord(second.data) && Array.isArray(second.data.tasks));
      assert.equal(first.data.tasks.length, 50);
      assert.equal(first.data.hasMore, true);
      assert.equal(second.data.tasks.length, 1);
      assert.equal(second.data.hasMore, false);
      const secondId = second.data.tasks[0].id;
      assert.ok(!first.data.tasks.some((task) => task.id === secondId));
    });
  } finally {
    if (users.length) {
      await db.query("DELETE FROM tasks WHERE user_id = ANY($1::bigint[])", [users]);
      await db.query("DELETE FROM users WHERE id = ANY($1::bigint[])", [users]);
    }
    await db.end();
  }
});
