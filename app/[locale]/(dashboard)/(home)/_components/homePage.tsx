"use client";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskBrowser } from "@/features/tasks/task-browser";
import { weekdays } from "@/features/tasks/types";
import { usePathname, useRouter } from "@/i18n/navigation";
export const HomePage = ({ defaultDay }: { defaultDay: number }) => {
  const t = useTranslations("tasksList");
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [changingDay, startDayChange] = useTransition();
  const requestedDay = search.get("day");
  const day =
    requestedDay !== null && /^[0-6]$/.test(requestedDay) ? Number(requestedDay) : defaultDay;
  const dayOptions = weekdays.map((name, index) => ({ value: String(index), label: t(name) }));

  function changeDay(nextDay: number) {
    if (!Number.isInteger(nextDay) || nextDay < 0 || nextDay > 6 || nextDay === day) return;
    const params = new URLSearchParams(search);
    params.set("day", String(nextDay));
    startDayChange(() => router.replace(`${pathname}?${params}`, { scroll: false }));
  }
  return (
    <Card className="mx-auto w-full max-w-4xl shadow-lg shadow-primary/5">
      <CardHeader className="border-b border-primary/10 bg-linear-to-br from-primary/5 to-card">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
            <CalendarDays aria-hidden="true" className="size-5" />
          </span>
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{t("title")}</CardTitle>
            <CardDescription>{t("dayHint")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-w-0">
        <Tabs value={String(day)} onValueChange={(value) => changeDay(Number(value))}>
          <div className="flex items-center gap-2 rounded-xl border bg-background/70 p-1.5 md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground"
              aria-label={t("previousDay")}
              title={t("previousDay")}
              disabled={day === 0 || changingDay}
              onClick={() => changeDay(day - 1)}
            >
              <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
            </Button>
            <div className="min-w-0 flex-1">
              <Select
                items={dayOptions}
                value={String(day)}
                disabled={changingDay}
                onValueChange={(value) => {
                  if (value !== null) changeDay(Number(value));
                }}
              >
                <SelectTrigger
                  aria-label={t("chooseDay")}
                  className="w-full min-w-0 border-0 bg-transparent px-2 shadow-none data-[size=default]:h-10 dark:bg-transparent dark:hover:bg-muted/50"
                >
                  <SelectValue className="min-w-0 text-start font-medium" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} className="rounded-xl p-1">
                  {dayOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="min-h-10 rounded-lg text-start"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground"
              aria-label={t("nextDay")}
              title={t("nextDay")}
              disabled={day === 6 || changingDay}
              onClick={() => changeDay(day + 1)}
            >
              <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
            </Button>
          </div>
          <TabsList
            className="hidden w-full gap-2 rounded-xl border border-primary/10 bg-linear-to-br from-primary/5 via-muted to-primary/10 p-2 group-data-horizontal/tabs:h-auto md:grid md:grid-cols-7"
            aria-label={t("chooseDay")}
          >
            {weekdays.map((name, index) => (
              <TabsTrigger
                className="h-auto min-h-11 min-w-0 rounded-lg px-2 py-2 text-foreground hover:bg-primary/10 hover:text-primary data-active:border-primary data-active:bg-primary data-active:text-primary-foreground data-active:shadow-md data-active:shadow-primary/20 dark:data-active:bg-primary dark:data-active:text-primary-foreground"
                key={name}
                value={String(index)}
                disabled={changingDay}
              >
                {t(name)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent className="mt-4" value={String(day)}>
            <TaskBrowser key={day} query={{ mode: "day", day }} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
