"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function HeaderNavigation() {
  const t = useTranslations("header");
  const pathname = usePathname();
  return (
    <nav
      aria-label={t("navigation")}
      className="col-span-2 flex items-center justify-between gap-4 border-t border-brand-foreground/10 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:gap-8 lg:border-t-0"
    >
      {[
        { href: "/", label: "home" },
        { href: "/create-tasks", label: "createTasks" },
        { href: "/parent-tasks", label: "parentTasks" },
      ].map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center justify-center border-b-2 border-transparent pt-1 text-xs font-medium text-brand-foreground/60 transition-colors hover:text-brand-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-brand-foreground sm:text-sm lg:min-h-18 lg:pt-0",
              active && "border-brand-foreground/80 text-brand-foreground",
            )}
          >
            {t(item.label)}
          </Link>
        );
      })}
    </nav>
  );
}
