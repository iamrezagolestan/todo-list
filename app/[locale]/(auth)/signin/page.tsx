import { SigninPage } from "./_components/signin-page";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "@/i18n/navigation";

export default async function Signin({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const user = await getCurrentUser();
  const { locale } = await params;
  if(user){
    redirect({
      href: "/",
      locale,
    });
  }
  return <SigninPage />;
}
