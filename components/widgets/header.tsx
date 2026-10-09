import { ListChecks } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HeaderControls } from "./header-controls";
import { HeaderNavigation } from "./header-navigation";
export const Header = () => {
  const t = useTranslations("header");
  return (
    <header className="border-b border-brand-foreground/10 bg-linear-to-r from-brand to-brand/95 text-brand-foreground">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-4 pt-3 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:pt-0">
        <Link
          href="/"
          className="flex w-fit min-w-0 items-center gap-2 rounded-sm text-sm font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-brand-foreground sm:gap-3 sm:text-base"
        >
          <ListChecks aria-hidden="true" className="size-5 shrink-0 text-brand-foreground/80" />
          {t("brand")}
        </Link>
        <HeaderControls />
        <HeaderNavigation />
      </div>
    </header>
  );
};
