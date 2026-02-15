import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json(
        { error: "Missing email or type" },
        { status: 400 },
      );
    }

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
