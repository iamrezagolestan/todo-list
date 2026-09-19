import argon2 from "argon2";
import { NextResponse } from "next/server";
import { findUserByEmail } from "@/generatedTypes/queries/users.queries";
import { db } from "@/lib/db";
import { attachSessionCookie, createSessionForUser } from "@/lib/session";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DUMMY_HASH =
  "$argon2id$v=19$m=65536,t=3,p=4$bXR3c3N4d2pncW5keW9sZg$M2Fyb2luZ2JsdWVzaXR0ZXJ1Y2xpYWNvbnR1c2Vy";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!EMAIL_PATTERN.test(email) || password.length === 0) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const [user] = await findUserByEmail.run({ email }, db);

  const isValid = user
    ? await argon2.verify(user.password, password)
    : await argon2.verify(DUMMY_HASH, password);

  if (!user || !isValid) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const sessionToken = await createSessionForUser(user.id);

  const response = NextResponse.json({
    id: user.id,
    email: user.email,
  });
  attachSessionCookie(response, sessionToken);

  return response;
}
