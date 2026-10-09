"use client";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { saveTask, TaskRequestError } from "@/api/tasks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type Task, weekdays } from "@/features/tasks/types";
import { useTasks } from "@/hooks/queries/use-tasks";

type FormState = { errors: { name?: string; days?: string; form?: string }; success: boolean };
const initialState: FormState = { errors: {}, success: false };
export const TasksForms = () => {
  const t = useTranslations("tasksForm");
  const errorsText = useTranslations("errors");
  const [days, setDays] = useState<number[]>([0]);
  const [draft, setDraft] = useState({ title: "", description: "" });
  const [isParent, setIsParent] = useState(false);
  const [parent, setParent] = useState<Task | null>(null);
  const [parentPage, setParentPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const { data, loading, error } = useTasks({ mode: "choices", page: parentPage }, revision);
  const [state, formAction, isPending] = useActionState(
    async (_previous: FormState, form: FormData): Promise<FormState> => {
      const title = String(form.get("name") ?? "").trim();
      const description = String(form.get("description") ?? "");
      const errors: FormState["errors"] = {};
      if (!title) errors.name = t("nameRequired");
      if (!days.length) errors.days = t("daysRequired");
      if (Object.keys(errors).length) return { errors, success: false };
      try {
        await saveTask({
          title,
          description,
          days,
          is_parent: isParent,
          parent_id: parent?.id ?? null,
        });
        setDraft({ title: "", description: "" });
        setRevision((value) => value + 1);
        return { errors: {}, success: true };
      } catch (reason) {
        const code = reason instanceof TaskRequestError ? reason.code : "server_error";
        return { errors: { form: errorsText(code) }, success: false };
      }
    },
    initialState,
  );
  const options = [...data.tasks];
  if (parent && !options.some((task) => task.id === parent.id)) options.unshift(parent);
  const items = [
    { value: "none", label: t("none") },
    ...options.map((task) => ({ value: task.id, label: task.title })),
  ];
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} id="task-form">
          <FieldGroup>
            {state.errors.form && (
              <p role="alert" className="text-destructive">
                {state.errors.form}
              </p>
            )}
            {state.success && (
              <p role="status" className="text-primary">
                {t("created")}
              </p>
            )}
            <Field data-invalid={!!state.errors.name}>
              <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
              <Input
                id="name"
                name="name"
                value={draft.title}
                onChange={(event) =>
                  setDraft((previous) => ({ ...previous, title: event.target.value }))
                }
                required
                maxLength={150}
                disabled={isPending}
                placeholder={t("namePlaceholder")}
                autoComplete="off"
                aria-invalid={!!state.errors.name}
              />
              {state.errors.name && <FieldError>{state.errors.name}</FieldError>}
            </Field>
            <Field data-invalid={!!state.errors.days}>
              <fieldset disabled={isPending} className="space-y-2">
                <legend className="mb-2 text-sm font-medium">{t("selectDays")}</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {weekdays.map((name, day) => (
                    <label
                      key={name}
                      htmlFor={`task-day-${day}`}
                      className="flex min-h-11 items-center gap-2 rounded-md border p-2 text-sm"
                    >
                      <Checkbox
                        id={`task-day-${day}`}
                        checked={days.includes(day)}
                        onCheckedChange={(checked) => {
                          setDays((previous) =>
                            checked
                              ? [...previous, day]
                              : previous.filter((value) => value !== day),
                          );
                        }}
                      />
                      {t(name)}
                    </label>
                  ))}
                </div>
              </fieldset>
              {state.errors.days && <FieldError>{state.errors.days}</FieldError>}
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="isParent"
                checked={isParent}
                disabled={isPending}
                onCheckedChange={setIsParent}
              />
              <FieldLabel htmlFor="isParent">{t("isParent")}</FieldLabel>
            </Field>
            <Field>
              <FieldLabel htmlFor="parent_id">{t("chooseParent")}</FieldLabel>
              <Select
                items={items}
                value={parent?.id ?? "none"}
                disabled={isPending || loading || !!error}
                onValueChange={(value) =>
                  setParent(options.find((task) => task.id === value) ?? null)
                }
              >
                <SelectTrigger id="parent_id" className="w-full min-w-0">
                  <SelectValue className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value} className="break-words">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loading && (
                <p role="status" className="text-sm text-muted-foreground">
                  {t("loadingParents")}
                </p>
              )}
              {error && (
                <>
                  <FieldError>{errorsText(error)}</FieldError>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRevision((value) => value + 1)}
                  >
                    {t("retry")}
                  </Button>
                </>
              )}
              {(parentPage > 0 || data.hasMore) && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={parentPage === 0 || loading || isPending}
                    onClick={() => setParentPage(parentPage - 1)}
                  >
                    {t("previousParents")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!data.hasMore || loading || isPending}
                    onClick={() => setParentPage(parentPage + 1)}
                  >
                    {t("nextParents")}
                  </Button>
                </div>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="description">{t("descriptionLabel")}</FieldLabel>
              <Textarea
                id="description"
                name="description"
                value={draft.description}
                onChange={(event) =>
                  setDraft((previous) => ({ ...previous, description: event.target.value }))
                }
                maxLength={900}
                rows={4}
                disabled={isPending}
                placeholder={t("descriptionPlaceholder")}
                className="min-h-24"
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="task-form" disabled={isPending}>
          {isPending ? t("submitting") : t("submit")}
        </Button>
      </CardFooter>
    </Card>
  );
};
