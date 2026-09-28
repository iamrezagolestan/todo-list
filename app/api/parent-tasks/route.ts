import { getParentTasks } from "@/generatedTypes/queries/parent-tasks.queries";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json(
            {
                message: "Unauthorized",
            },
            {
                status: 401,
            },
        )
    }

    try {
        const result = await getParentTasks.run({
            user_id: user.id,
        }, db)
        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to create task" }), { status: 500 });
    }
}