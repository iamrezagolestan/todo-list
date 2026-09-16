"use client";

import Form from "next/form";
import { useState } from "react";
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { Spinner } from "@/components/ui/spinner";

const items = [
  { label: "Select a fruit", value: null },
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
];

const daysItems = [
  { label: "All days", value: "all" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
];
export const TasksForms = () => {
  const [descriptionLength, setDescriptionLength] = useState(0);
  const formAction = () => {
    console.log("clicked form", new Date());
  };
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Tasks</CardTitle>
          <CardDescription>Add weekly / long-term tasks here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={formAction} id="bug-report-form">
            <FieldGroup>
              <Field
              //  data-invalid={!!formState.errors?.title?.length}
              >
                <FieldLabel htmlFor="title">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  // defaultValue={formState.values.name}
                  // disabled={pending}
                  // aria-invalid={!!formState.errors?.name?.length}
                  placeholder="Enter your task name ... "
                  autoComplete="off"
                />
                {/* {formState.errors?.title && (
                <FieldError>{formState.errors.title[0]}</FieldError>
              )} */}
              </Field>
              <Field>
                <FieldLabel>Select days</FieldLabel>
                <Select items={daysItems} defaultValue="all">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>days</SelectLabel>
                      {daysItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field orientation="horizontal">
                <Checkbox />
                <FieldLabel htmlFor="isParent">is parent</FieldLabel>
              </Field>
              <Field>
                <FieldLabel>Choose parent</FieldLabel>
                <Select items={items}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>parents</SelectLabel>
                      {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field
              //  data-invalid={!!formState.errors?.description?.length}
              >
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    id="description"
                    name="description"
                    //   defaultValue={formState.values.description}
                    placeholder="Write task's description ... "
                    rows={6}
                    className="min-h-24 resize-none"
                    //   disabled={pending}
                    //   aria-invalid={!!formState.errors?.description?.length}
                    onChange={(e) => setDescriptionLength(e.target.value.length)}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {descriptionLength}/100 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Include steps to reproduce, expected behavior, and what actually happened.
                </FieldDescription>
                {/* {formState.errors?.description && (
                <FieldError>{formState.errors.description[0]}</FieldError>
              )} */}
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="submit" form="bug-report-form">
              {/* {pending && <Spinner />} */}
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};
