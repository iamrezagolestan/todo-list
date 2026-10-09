import type { PoolClient } from "pg";
import { createTask } from "@/generatedTypes/queries/create-tasks.queries";
import { deleteTasks } from "@/generatedTypes/queries/delete-tasks.queries";
import {
  findTask,
  getTaskAncestors,
  setTaskDone,
  syncParent,
  syncTaskDone,
} from "@/generatedTypes/queries/get-tasks.queries";
import { db } from "@/lib/db";

export class TaskError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
  }
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function taskId(value: unknown): string {
  if (typeof value === "number" && Number.isSafeInteger(value)) value = String(value);
  if (
    typeof value !== "string" ||
    !/^[1-9]\d{0,18}$/.test(value) ||
    BigInt(value) > BigInt("9223372036854775807")
  ) {
    throw new TaskError("invalid_input", 400);
  }
  return value;
}
async function transaction<T>(userId: string, action: (client: PoolClient) => Promise<T>) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    // Serialize sibling mutations so concurrent updates cannot leave a stale parent.
    await client.query("SELECT pg_advisory_xact_lock($1::bigint)", [userId]);
    const result = await action(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
async function syncAncestors(client: PoolClient, userId: string, id: string | null) {
  if (!id) return;
  const ancestors = await getTaskAncestors.run({ id, user_id: userId }, client);
  for (const ancestor of ancestors)
    await syncParent.run({ id: ancestor.id, user_id: userId }, client);
}
export async function addTask(userId: string, body: unknown) {
  if (!isRecord(body)) throw new TaskError("invalid_input", 400);
  const { title, description = null, is_parent = false, days } = body;
  if (
    typeof title !== "string" ||
    !title.trim() ||
    title.trim().length > 150 ||
    (description !== null && (typeof description !== "string" || description.length > 900)) ||
    typeof is_parent !== "boolean" ||
    !Array.isArray(days) ||
    days.length < 1 ||
    days.length > 7 ||
    !days.every(
      (day: unknown) => typeof day === "number" && Number.isInteger(day) && day >= 0 && day <= 6,
    )
  ) {
    throw new TaskError("invalid_input", 400);
  }
  const parentId = body.parent_id == null ? null : taskId(body.parent_id);
  return transaction(userId, async (client) => {
    if (parentId) {
      const [parent] = await findTask.run({ id: parentId, user_id: userId }, client);
      if (!parent?.is_parent) throw new TaskError("invalid_parent", 400);
    }
    const [task] = await createTask.run(
      {
        title: title.trim(),
        description,
        is_parent,
        parent_id: parentId,
        user_id: userId,
        days: [...new Set<number>(days)],
      },
      client,
    );
    await syncAncestors(client, userId, parentId);
    return task;
  });
}
export async function mutateTask(userId: string, body: unknown, operation: "delete" | "done") {
  if (!isRecord(body)) throw new TaskError("invalid_input", 400);
  const id = taskId(body.id);
  if (operation === "done" && typeof body.is_done !== "boolean")
    throw new TaskError("invalid_input", 400);
  if (
    operation === "done" &&
    (typeof body.day !== "number" || !Number.isInteger(body.day) || body.day < 0 || body.day > 6)
  )
    throw new TaskError("invalid_input", 400);
  return transaction(userId, async (client) => {
    const [task] = await findTask.run({ id, user_id: userId }, client);
    if (!task) throw new TaskError("task_not_found", 404);
    if (operation === "delete") {
      await deleteTasks.run({ id, user_id: userId }, client);
    } else {
      if (task.is_parent) throw new TaskError("parent_automatic", 409);
      if (typeof body.is_done !== "boolean") throw new TaskError("invalid_input", 400);
      if (typeof body.day !== "number" || !task.days.includes(body.day))
        throw new TaskError("invalid_input", 400);
      await setTaskDone.run({ id, user_id: userId, day: body.day, is_done: body.is_done }, client);
      await syncTaskDone.run({ id, user_id: userId }, client);
    }
    await syncAncestors(client, userId, task.parent_id);
    return { id };
  });
}
