import { Header } from "@/components/widgets/header";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const user = await getCurrentUser();

  // if (!user) {
  //   redirect("/signin");
  // }
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
