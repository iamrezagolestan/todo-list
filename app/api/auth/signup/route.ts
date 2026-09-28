import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { db } from "@/lib/db";
import {
  findUserByEmail,
  createUser,
} from "@/generatedTypes/queries/users.queries";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    const normalizedEmail = email.trim().toLowerCase();
    
    if (!normalizedEmail || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const existingUsers = await findUserByEmail.run(
      {
        email: normalizedEmail,
      },
      db
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const users = await createUser.run(
      {
        email: normalizedEmail,
        password: hashedPassword,
      },
      db
    );

    const user = users[0];

    return NextResponse.json(
      {
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
