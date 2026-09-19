"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

export function SignOutButton() {
  const t = useTranslations("home");
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.replace("/signin");
    } catch {
      router.replace("/signin");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button type="button" variant="outline" onClick={handleSignOut} disabled={isPending}>
      <LogOut />
      {t("signOut")}
    </Button>
  );
}
