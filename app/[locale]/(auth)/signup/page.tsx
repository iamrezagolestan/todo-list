import { redirect } from "@/i18n/navigation";
import { SignupPage } from "./_components/signup-page";
import { getCurrentUser } from "@/lib/auth/session";

export default async function Signup({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const user = await getCurrentUser();
  const { locale } = await params;
  if (user) {
    redirect({
      href: "/",
      locale,
    });
  }

  return <SignupPage />;
}
