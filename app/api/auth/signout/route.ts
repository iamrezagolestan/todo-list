import { NextResponse } from "next/server";
import { deleteUserSession } from "@/lib/auth/session";

export async function POST() {
  await deleteUserSession();

  const response = NextResponse.json({ ok: true });

  return response;
}
