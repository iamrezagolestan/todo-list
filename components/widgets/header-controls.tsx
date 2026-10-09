"use client";

import { Languages, LogOut, Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState, useTransition } from "react";
import { signOut } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePathname, useRouter } from "@/i18n/navigation";

const controlClassName =
  "size-8 rounded-lg border-0 bg-transparent text-brand-foreground/70 shadow-none hover:bg-brand-foreground/10 hover:text-brand-foreground focus-visible:ring-brand-foreground/40 dark:hover:bg-brand-foreground/10";

export function HeaderControls() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [changingLanguage, startLanguageChange] = useTransition();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState(false);
  const busy = changingLanguage || signingOut;

  function changeLanguage() {
    const nextLocale = locale === "fa" ? "en" : "fa";
    const destination = `${pathname}${window.location.search}${window.location.hash}`;
    startLanguageChange(() => router.replace(destination, { locale: nextLocale, scroll: false }));
  }

  async function handleSignOut() {
    setSigningOut(true);
    setError(false);
    try {
      await signOut();
      // A full navigation clears cached authenticated screens after the cookie is removed.
      window.location.replace(`/${locale}/signin`);
    } catch {
      setError(true);
      setSigningOut(false);
    }
  }

  return (
    <div className="relative col-start-2 row-start-1 min-w-0 justify-self-end lg:col-start-3">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={controlClassName}
          aria-label={t("toggleTheme")}
          title={t("toggleTheme")}
          disabled={busy}
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Moon aria-hidden="true" className="dark:hidden" />
          <Sun aria-hidden="true" className="hidden dark:block" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={controlClassName}
          aria-label={t("switchLanguage")}
          title={t("switchLanguage")}
          disabled={busy}
          onClick={changeLanguage}
        >
          <Languages aria-hidden="true" />
        </Button>
        <span className="ms-1 flex border-s border-brand-foreground/15 ps-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={controlClassName}
            aria-label={t("signOut")}
            title={t("signOut")}
            aria-busy={signingOut}
            disabled={busy}
            onClick={() => void handleSignOut()}
          >
            {signingOut ? <Spinner /> : <LogOut aria-hidden="true" />}
          </Button>
        </span>
      </div>
      {error && (
        <p
          role="alert"
          className="absolute end-0 top-full z-20 mt-2 w-64 rounded-lg border bg-popover p-3 text-sm text-popover-foreground shadow-lg"
        >
          {t("signOutError")}
        </p>
      )}
    </div>
  );
}
