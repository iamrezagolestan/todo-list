"use client";

import Form from "next/form";
import React, { useActionState, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

type FormState = {
  errors: {
    name?: string;
    days?: string;
    description?: string;
  };
};

const initialState: FormState = {
  errors: {},
};

export const TasksForms = () => {
  const t = useTranslations("tasksForm");
  const locale = useLocale();
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [showParents, setShowParents] = useState(false);
  const [taskData, setTaskData] = useState({});
  const [parentsItems, setParentsItems] = useState<
    { label: string; value: string }[]
  >([]);
  const anchor = useComboboxAnchor();
  const [state, formAction, isPending] = useActionState(
    async (
      _previousState: FormState,
      formData: FormData,
    ): Promise<FormState> => {
      const data = Object.fromEntries(formData.entries());
      const days = formData.getAll("days").map(Number);
      const errors: FormState["errors"] = {};

      // Name validation
      if (!data.name || !data.name.toString().trim()) {
        errors.name = t("nameRequired");
      }

      if (Object.keys(errors).length > 0) {
        return {
          errors,
        };
      }
      await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.name,
          description: data.description,
          is_parent: data.isParent === "on",
          parent_id: data.parent_id === "none" ? null : data.parent_id,
          days: days,
        }),
      });
      return {
        errors: {},
      };
    },
    initialState,
  );

  useEffect(() => {
    const getParents = async () => {
      const response = await fetch("/api/parent-tasks");

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const parents = data.map((parent: { id: number; title: string }) => ({
        label: parent.title,
        value: String(parent.id),
      }));
      const realParents = parents.unshift({ label: "none", value: "none" });
      console.log(realParents, parents);

      setParentsItems(parents);
    };

    getParents();
  }, [isPending]);

  const daysItems = [
    { label: t("saturday"), value: "0" },
    { label: t("sunday"), value: "1" },
    { label: t("monday"), value: "2" },
    { label: t("tuesday"), value: "3" },
    { label: t("wednesday"), value: "4" },
    { label: t("thursday"), value: "5" },
    { label: t("friday"), value: "6" },
  ];

  const checkIsParent = (value: boolean) => {
    setShowParents(value);
    setTaskData((prev) => ({ ...prev, parent_id: "none" }));
  };

  return (
    <div className="flex h-[calc(100vh-120px)] w-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>

          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} id="task-form">
            <FieldGroup>
              {/* NAME */}
              <Field data-invalid={!!state.errors.name}>
                <FieldLabel htmlFor="name">{t("name")}</FieldLabel>

                <Input
                  id="name"
                  name="name"
                  placeholder={t("namePlaceholder")}
                  autoComplete="off"
                  aria-invalid={!!state.errors.name}
                />

                {state.errors.name && (
                  <FieldError>{state.errors.name}</FieldError>
                )}
              </Field>

              {/* DAYS */}
              <Field data-invalid={!!state.errors.days}>
                <FieldLabel htmlFor="days">{t("selectDays")}</FieldLabel>

                <Combobox
                  multiple
                  autoHighlight
                  items={daysItems}
                  isItemEqualToValue={(item, value) =>
                    item.value === value.value
                  }
                  defaultValue={[daysItems[0]]}
                  id="days"
                  name="days"
                >
                  <ComboboxChips ref={anchor} className="w-full">
                    <ComboboxValue>
                      {(values) => (
                        <>
                          {values.map((value: any) => (
                            <ComboboxChip key={value.value}>
                              {value.label}
                            </ComboboxChip>
                          ))}

                          <ComboboxChipsInput />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>

                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>

                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              {/* IS PARENT */}
              <Field orientation="horizontal">
                <Checkbox
                  onCheckedChange={checkIsParent}
                  id="isParent"
                  name="isParent"
                />

                <FieldLabel htmlFor="isParent">{t("isParent")}</FieldLabel>
              </Field>

              {/* PARENT */}
              {!showParents && (
                <Field>
                  <FieldLabel htmlFor="parent_id">
                    {t("chooseParent")}
                  </FieldLabel>

                  <Select
                    onValueChange={(value) => {
                      setTaskData((prev) => ({
                        ...prev,
                        parent_id: value,
                      }));
                    }}
                    items={parentsItems}
                    name="parent_id"
                    defaultValue="none"
                  >
                    <SelectTrigger id="parent_id" className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("parents")}</SelectLabel>

                        {parentsItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}

              {/* DESCRIPTION */}
              <Field data-invalid={!!state.errors.description}>
                <FieldLabel htmlFor="description">
                  {t("descriptionLabel")}
                </FieldLabel>

                <InputGroup>
                  <InputGroupTextarea
                    id="description"
                    name="description"
                    placeholder={t("descriptionPlaceholder")}
                    rows={6}
                    maxLength={100}
                    className="min-h-24 resize-none"
                    aria-invalid={!!state.errors.description}
                    onChange={(e) =>
                      setDescriptionLength(e.target.value.length)
                    }
                  />

                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {t("characters", {
                        count: descriptionLength,
                      })}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                <FieldDescription
                  className={`${locale === "fa" ? "text-right" : "text-left"}`}
                >
                  {t("descriptionHint")}
                </FieldDescription>

                {state.errors.description && (
                  <FieldError>{state.errors.description}</FieldError>
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal">
            <Button type="submit" form="task-form" disabled={isPending}>
              {isPending ? "Submitting..." : t("submit")}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};
