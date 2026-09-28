import { createTask } from "@/generatedTypes/queries/create-tasks.queries";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { NextResponse } from "next/server";

type CreateTaskBody = {
    title: string;
    description?: string | null;
    is_parent?: boolean;
    parent_id?: number | null;
    days: number[];
};

export async function POST(request: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            {
                message: "Unauthorized",
            },
            {
                status: 401,
            },
        );
    }

    try {

        const body: CreateTaskBody = await request.json();

        const { title, description, is_parent, parent_id, days } = body;
        const result = await createTask.run({ title, description, is_parent, parent_id, user_id: user.id, days }, db);
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to create task" }), { status: 500 });
    }
}
