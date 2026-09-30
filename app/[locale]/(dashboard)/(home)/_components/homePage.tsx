"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type DataType = {
  id: string;
  title: string;
  description: string;
  is_parent: string | null;
  user_id: string;
  days: number[];
  created_at: string;
}[];
export const HomePage = ({ data }: { data: DataType }) => {
    const [tasks , setTasks] = useState() 
  const locale = useLocale();
  const t = useTranslations("tasksList");
  const days = [
    { id: 0, value: "saturday", name: t("saturday") },
    { id: 1, value: "sunday", name: t("sunday") },
    { id: 2, value: "monday", name: t("monday") },
    { id: 3, value: "tuesday", name: t("tuesday") },
    { id: 4, value: "wednesday", name: t("wednesday") },
    { id: 5, value: "thursday", name: t("thursday") },
    { id: 6, value: "friday", name: t("friday") },
  ];
    useEffect(() => {
      const getTasks = async () => {
        const response = await fetch("/api/tasks");
  
        if (!response.ok) {
          return;
        }
  
        const data = await response.json();
  
       setTasks(data);
      };
  
      getTasks();
    }, []);

    if(!tasks){
      return <div className="h-screen w-full">is loading...</div>
    }
  return (
    <Card className="m-10 max-h-[calc(100vh-150px)] pb-10">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          className="w-screen h-[calc(100vh-120px)] flex flex-row"
          defaultValue={"saturday"}
        >
          <TabsList>
            {days.map((item) => {
              // const isExist =
              return (
                <TabsTrigger
                key={item.id}
                  value={item.value}
                  className={`${locale === "fa" ? "ml-3" : "mr-3"}`}
                >
                  {item.name}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {days.map((contentItem) => {
            const todayTasks = tasks.filter((taskData) => taskData.days.includes(contentItem.id))
            return (
              <TabsContent value={contentItem.value} className="w-3xl mt-10" key={contentItem.id}>
                {todayTasks.map((dataItem) => (
                      <Item className="border-b border-b-primary mb-2 rounded-none" key={dataItem.id}>
                        <ItemMedia variant={"image"}><Checkbox className="cursor-pointer" id="isDone" name="isDone" /></ItemMedia>
                        <ItemContent>
                          <ItemTitle>{dataItem.title}</ItemTitle>
                          <ItemDescription>{dataItem.description}</ItemDescription>
                        </ItemContent>
                      </Item>
                    ))}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};
