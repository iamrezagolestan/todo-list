import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { findUserByEmail } from "@/generatedTypes/queries/users.queries";
import { db } from "@/lib/db";
import { createUserSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    const users = await findUserByEmail.run(
      {
        email,
      },
      db,
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    await createUserSession(user.id);

    return NextResponse.json(
      {
        message: "Login successful",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
