import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/utils/apiErrorHandler";
import { z } from "zod";

const EXTERNAL_API = process.env.NEXT_PUBLIC_CMS_API_URL || "https://lotto-x-cms.vercel.app";

const bodySchema = z.object({
  email: z.email("Invalid email address"),
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

    // Proxy to external CMS API
    const res = await fetch(`${EXTERNAL_API}/api/v1/users/_/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, lotteryId }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || "Subscription failed" },
        { status: res.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: data?.message || "Subscribed successfully",
      ...data,
    });
  } catch (error: unknown) {
    return handleApiError(error, "Subscribe");
  }
}
