export type Task = {
  id: string;
  title: string;
  description: string | null;
  is_parent: boolean;
  parent_id: string | null;
  is_done: boolean;
  days: number[];
  has_children: boolean;
  completed_days: number[];
};
export type TaskPage = { tasks: Task[]; hasMore: boolean };
export type TaskQuery = {
  mode: "day" | "parents" | "children" | "choices";
  day?: number;
  parentId?: string;
  page?: number;
  revision?: number;
};
export const weekdays = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;
