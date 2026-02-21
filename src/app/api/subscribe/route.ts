import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email("Invalid email address"),
  type: z.string().min(1, "Type is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate body
    const validation = bodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, type } = validation.data;

    // Upsert subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        type: type.toUpperCase(),
        active: true,
      },
    });

    return NextResponse.json({ success: true, subscriber });
  } catch (error) {
    console.error("Subscribe API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
