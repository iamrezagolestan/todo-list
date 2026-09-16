"use client";

import Form from "next/form";
import { useState } from "react";
import { useTranslations } from "next-intl";

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

export const TasksForms = () => {
  const t = useTranslations("tasksForm");

  const [descriptionLength, setDescriptionLength] = useState(0);

  const daysItems = [
    { label: t("allDays"), value: "all" },
    { label: t("saturday"), value: "saturday" },
    { label: t("sunday"), value: "sunday" },
    { label: t("monday"), value: "monday" },
    { label: t("tuesday"), value: "tuesday" },
    { label: t("wednesday"), value: "wednesday" },
    { label: t("thursday"), value: "thursday" },
    { label: t("friday"), value: "friday" },
  ];

  const parentsItems = [
    { label: t("selectParent"), value: "none" },
    { label: "Parent 1", value: "parent-1" },
    { label: "Parent 2", value: "parent-2" },
  ];

  const formAction = () => {
    console.log("clicked form", new Date());
  };

  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>

          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form action={formAction} id="task-form">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">
                  {t("name")}
                </FieldLabel>

                <Input
                  id="name"
                  name="name"
                  placeholder={t("namePlaceholder")}
                  autoComplete="off"
                />
              </Field>

              <Field>
                <FieldLabel>
                  {t("selectDays")}
                </FieldLabel>

                <Select
                  items={daysItems}
                  defaultValue="all"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        {t("days")}
                      </SelectLabel>

                      {daysItems.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field orientation="horizontal">
                <Checkbox id="isParent" name="isParent" />

                <FieldLabel htmlFor="isParent">
                  {t("isParent")}
                </FieldLabel>
              </Field>

              <Field>
                <FieldLabel>
                  {t("chooseParent")}
                </FieldLabel>

                <Select items={parentsItems}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        {t("parents")}
                      </SelectLabel>

                      {parentsItems.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
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

                <FieldDescription>
                  {t("descriptionHint")}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="submit"
              form="task-form"
            >
              {t("submit")}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};
