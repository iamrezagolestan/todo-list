import { getLocale } from "next-intl/server";
import { Header } from "@/components/widgets/header";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/session";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/signin", locale: await getLocale() });
  return (
    <div className="min-h-svh bg-linear-to-br from-primary/5 via-background to-accent/50">
      <Header />
      <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 sm:py-8">{children}</main>
    </div>
  );
}
