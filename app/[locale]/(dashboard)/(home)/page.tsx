import { connection } from "next/server";
import { Suspense } from "react";
import { getTodayTaskDay } from "./_components/day-selection";
import { HomePage } from "./_components/homePage";
export default async function Page() {
  await connection();
  const today = getTodayTaskDay();
  return (
    <Suspense>
      <HomePage defaultDay={today} />
    </Suspense>
  );
}
