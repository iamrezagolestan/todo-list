import { NextResponse } from "next/server";
import { getTasks } from "@/generatedTypes/queries/get-tasks.queries";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { addTask, mutateTask, TaskError, taskId } from "@/lib/tasks";

function errorResponse(error: unknown) {
  if (error instanceof TaskError)
    return NextResponse.json({ code: error.code }, { status: error.status });
  if (error instanceof SyntaxError)
    return NextResponse.json({ code: "invalid_input" }, { status: 400 });
  console.error("Task request failed", error);
  return NextResponse.json({ code: "server_error" }, { status: 500 });
}
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ code: "unauthorized" }, { status: 401 });
    const search = new URL(request.url).searchParams;
    const mode = search.get("mode") ?? "day";
    if (!["day", "parents", "children", "choices"].includes(mode))
      throw new TaskError("invalid_input", 400);
    const pageText = search.get("page") ?? "0";
    const dayText = search.get("day") ?? "0";
    if (!/^\d{1,5}$/.test(pageText) || !/^[0-6]$/.test(dayText))
      throw new TaskError("invalid_input", 400);
    let parentId: string | null = null;
    if (mode === "children") parentId = taskId(search.get("parentId"));
    const tasks = await getTasks.run(
      {
        user_id: user.id,
        mode,
        day: Number(dayText),
        parent_id: parentId,
        limit: 51,
        offset: Number(pageText) * 50,
      },
      db,
    );
    return NextResponse.json({ tasks: tasks.slice(0, 50), hasMore: tasks.length > 50 });
  } catch (error) {
    return errorResponse(error);
  }
}
async function write(request: Request, operation: "create" | "delete" | "done") {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ code: "unauthorized" }, { status: 401 });
    const body: unknown = await request.json();
    if (operation === "create")
      return NextResponse.json(await addTask(user.id, body), { status: 201 });
    return NextResponse.json(await mutateTask(user.id, body, operation));
  } catch (error) {
    return errorResponse(error);
  }
}
export async function POST(request: Request) {
  return write(request, "create");
}
export async function DELETE(request: Request) {
  return write(request, "delete");
}
export async function PATCH(request: Request) {
  return write(request, "done");
}
