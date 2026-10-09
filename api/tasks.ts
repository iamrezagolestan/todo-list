import type { TaskPage, TaskQuery } from "@/features/tasks/types";
export class TaskRequestError extends Error {
  constructor(public code: string) {
    super(code);
  }
}
async function responseData(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new TaskRequestError(data.code ?? "server_error");
  return data;
}
export async function fetchTasks(query: TaskQuery, signal?: AbortSignal): Promise<TaskPage> {
  const params = new URLSearchParams({ mode: query.mode, page: String(query.page ?? 0) });
  if (query.day !== undefined) params.set("day", String(query.day));
  if (query.parentId) params.set("parentId", query.parentId);
  if (query.revision !== undefined) params.set("revision", String(query.revision));
  return responseData(await fetch(`/api/tasks?${params}`, { signal, cache: "no-store" }));
}
export async function saveTask(body: {
  title: string;
  description: string;
  is_parent: boolean;
  parent_id: string | null;
  days: number[];
}) {
  return responseData(
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}
export async function changeTask(id: string, isDone?: boolean, day?: number) {
  return responseData(
    await fetch("/api/tasks", {
      method: isDone === undefined ? "DELETE" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_done: isDone, day }),
    }),
  );
}
