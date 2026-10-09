"use client";
import { ChevronDown, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { changeTask, TaskRequestError } from "@/api/tasks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useTasks } from "@/hooks/queries/use-tasks";
import { cn } from "@/lib/utils";
import { type Task, type TaskQuery, weekdays } from "./types";

type BranchProps = {
  query: TaskQuery;
  revision: number;
  busy: boolean;
  onChange: (task: Task, done?: boolean, day?: number) => Promise<void>;
  onRetry: () => void;
  tree: boolean;
};
function TaskBranch(props: BranchProps) {
  const t = useTranslations("tasksList");
  const errors = useTranslations("errors");
  const [page, setPage] = useState(0);
  const { data, loading, error } = useTasks({ ...props.query, page }, props.revision);
  if (loading && data.tasks.length === 0)
    return (
      <p className="flex items-center gap-2 py-4" role="status">
        <Spinner />
        {t("loading")}
      </p>
    );
  if (error)
    return (
      <div className="space-y-2 py-4">
        <p role="alert" className="text-destructive">
          {errors(error)}
        </p>
        <Button type="button" variant="outline" onClick={props.onRetry}>
          {t("retry")}
        </Button>
      </div>
    );
  return (
    <div className="min-w-0 space-y-3">
      {data.tasks.length === 0 && <p className="py-4 text-muted-foreground">{t("empty")}</p>}
      <ul className="min-w-0 space-y-3">
        {data.tasks.map((task) => (
          <TaskRow key={task.id} task={task} {...props} busy={props.busy || loading} />
        ))}
      </ul>
      {(page > 0 || data.hasMore) && (
        <nav aria-label={t("pagination")} className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={page === 0 || props.busy || loading}
            onClick={() => setPage(page - 1)}
          >
            {t("previous")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!data.hasMore || props.busy || loading}
            onClick={() => setPage(page + 1)}
          >
            {t("next")}
          </Button>
        </nav>
      )}
    </div>
  );
}
function TaskRow({ task, ...props }: BranchProps & { task: Task }) {
  const t = useTranslations("tasksList");
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const checked = task.is_parent
    ? task.is_done
    : task.completed_days.includes(props.query.day ?? -1);
  let displayedDone = checked;
  if (props.tree) displayedDone = task.is_done;
  const title = (
    <span
      className={cn(
        "break-words font-medium [overflow-wrap:anywhere]",
        displayedDone && "text-muted-foreground line-through",
      )}
    >
      {task.title}
    </span>
  );
  let renderedTitle = title;
  if (props.tree && task.is_parent) {
    renderedTitle = (
      <Button
        type="button"
        variant="ghost"
        className="min-h-10 h-auto max-w-full justify-start whitespace-normal p-0 text-start"
        aria-expanded={expanded}
        aria-controls={`children-${task.id}`}
        disabled={props.busy}
        onClick={() => setExpanded(!expanded)}
      >
        {title}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 shrink-0", expanded && "rotate-180")}
        />
      </Button>
    );
  }
  return (
    <li className="min-w-0 rounded-lg border bg-card p-3 sm:p-4">
      <div className="flex min-w-0 items-start gap-3">
        {(!props.tree || task.is_parent) && (
          <Checkbox
            className="mt-1 size-5"
            checked={checked}
            disabled={props.busy || task.is_parent}
            aria-label={t("toggle", { title: task.title })}
            onCheckedChange={(value) => void props.onChange(task, value, props.query.day)}
          />
        )}
        <div className="min-w-0 flex-1 space-y-1">
          {renderedTitle}
          {task.description && (
            <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground [overflow-wrap:anywhere]">
              {task.description}
            </p>
          )}
          {task.is_parent && <p className="text-xs text-muted-foreground">{t("automatic")}</p>}
          {props.tree && !task.is_parent && (
            <div className="flex flex-wrap gap-3 py-2">
              {task.days.map((day) => (
                <label
                  key={day}
                  htmlFor={`task-${task.id}-day-${day}`}
                  className="flex min-h-10 items-center gap-2 text-sm"
                >
                  <Checkbox
                    id={`task-${task.id}-day-${day}`}
                    checked={task.completed_days.includes(day)}
                    disabled={props.busy}
                    aria-label={t("toggleDay", { title: task.title, day: t(weekdays[day]) })}
                    onCheckedChange={(value) => void props.onChange(task, value, day)}
                  />
                  {t(weekdays[day])}
                </label>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {displayedDone ? t("done") : t("notDone")}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 text-destructive"
          aria-label={t("delete", { title: task.title })}
          disabled={props.busy}
          onClick={() => setConfirming(true)}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
      {confirming && (
        <div className="mt-3 space-y-2 rounded-md bg-muted p-3">
          <p className="text-sm">
            {task.is_parent ? t("confirmParentDelete") : t("confirmDelete")}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="destructive"
              disabled={props.busy}
              onClick={() => void props.onChange(task)}
            >
              {t("confirm")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={props.busy}
              onClick={() => setConfirming(false)}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}
      {expanded && (
        <div id={`children-${task.id}`} className="mt-4 min-w-0 border-s ps-2 sm:ps-4">
          <TaskBranch {...props} query={{ mode: "children", parentId: task.id }} />
        </div>
      )}
    </li>
  );
}
export function TaskBrowser({ query, tree = false }: { query: TaskQuery; tree?: boolean }) {
  const errors = useTranslations("errors");
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function onChange(task: Task, done?: boolean, day?: number) {
    setBusy(true);
    setError(null);
    try {
      await changeTask(task.id, done, day);
      setRevision((value) => value + 1);
    } catch (reason) {
      setError(reason instanceof TaskRequestError ? reason.code : "server_error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div aria-busy={busy} className="space-y-3">
      {error && (
        <p role="alert" className="text-destructive">
          {errors(error)}
        </p>
      )}
      <TaskBranch
        query={query}
        tree={tree}
        revision={revision}
        busy={busy}
        onChange={onChange}
        onRetry={() => setRevision((value) => value + 1)}
      />
    </div>
  );
}
