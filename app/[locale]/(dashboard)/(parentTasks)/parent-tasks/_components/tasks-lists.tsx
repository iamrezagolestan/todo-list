import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskBrowser } from "@/features/tasks/task-browser";
export const TasksLists = async () => {
  const t = await getTranslations("tasksList");
  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{t("parentsTitle")}</CardTitle>
        <CardDescription>{t("treeHint")}</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <TaskBrowser query={{ mode: "parents" }} tree />
      </CardContent>
    </Card>
  );
};
