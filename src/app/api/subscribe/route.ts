import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/utils/apiErrorHandler";
const API_KEY = process.env.API_KEY || "";

import { z } from "zod";

const EXTERNAL_API = process.env.CMS_API_URL || "https://lotto-x-cms.vercel.app";

const bodySchema = z.object({
  email: z.string().email("Invalid email address"),
  lotteryId: z.number().int().positive("lotteryId must be a positive integer"),
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

    const { email, lotteryId } = validation.data;

    // Proxy to external API
    const res = await fetch(`${EXTERNAL_API}/api/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ email, lotteryId }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "Subscription failed" },
        { status: res.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error: unknown) {
    return handleApiError(error, "Subscribe");
  }
}
