"use client";
import { useEffect, useState } from "react";
import { fetchTasks, TaskRequestError } from "@/api/tasks";
import type { TaskPage, TaskQuery } from "@/features/tasks/types";
export function useTasks(query: TaskQuery, revision: number) {
  const { mode, day, parentId, page = 0 } = query;
  const [data, setData] = useState<TaskPage>({ tasks: [], hasMore: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchTasks({ mode, day, parentId, page, revision }, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(reason instanceof TaskRequestError ? reason.code : "server_error");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [mode, day, parentId, page, revision]);
  return { data, loading, error };
}
