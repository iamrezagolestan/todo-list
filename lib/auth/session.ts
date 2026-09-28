import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { findUserById } from "@/generatedTypes/queries/users.queries";
import { createSession, deleteSession, getSession } from "@/generatedTypes/queries/sessions.queries";
import { db } from "@/lib/db";

const SESSION_COOKIE_NAME = "session_id";
const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function createUserSession(userId: string) {
  const sessionId = randomUUID();

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await createSession.run(
    {
      id: sessionId,
      user_id: userId,
      expires_at: expiresAt,
    },
    db,
  );

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function getUserSession() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  const session = await getSession.run(
    {
      id: sessionId,
    },
    db,
  );

  if (session.length === 0) {
    return null;
  }

  const currentSession = session[0];

  if (currentSession.expires_at < new Date()) {
    await deleteSession.run(
      {
        id: sessionId,
      },
      db,
    );

    cookieStore.delete(SESSION_COOKIE_NAME);

    return null;
  }

  return currentSession;
}

export async function deleteUserSession() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return;
  }

  await deleteSession.run(
    {
      id: sessionId,
    },
    db,
  );

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const session = await getUserSession();

  if (!session) {
    return null;
  }

  const users = await findUserById.run(
    {
      id: session.user_id,
    },
    db,
  );

  if (users.length === 0) {
    return null;
  }

  return users[0];
}
