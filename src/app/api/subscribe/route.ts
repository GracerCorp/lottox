import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const normalizedType = type.toUpperCase();

    // 1. Find or create the user basic record based on email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // We mock an ID for new users because `user.id` is a String standard usually driven by NextAuth
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          email: email,
          name: email.split("@")[0],
          is_active: true,
        },
      });
    }

    // 2. Find the lottery job
    const lotteryJob = await prisma.lottery_jobs.findFirst({
      where: { name: { equals: normalizedType, mode: "insensitive" } },
    });

    if (!lotteryJob) {
      return NextResponse.json(
        { error: `Lottery type ${type} not supported` },
        { status: 400 },
      );
    }

    // 3. Upsert subscription
    // Check if subscription exists
    const existingSub = await prisma.lottery_subscriptions.findFirst({
      where: { user_id: user.id, lottery_id: lotteryJob.id },
    });

    if (!existingSub) {
      await prisma.lottery_subscriptions.create({
        data: {
          user_id: user.id,
          lottery_id: lotteryJob.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error("Subscribe API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
