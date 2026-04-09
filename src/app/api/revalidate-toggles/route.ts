import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // @ts-expect-error - requires 2 arguments in next cache typings
    revalidateTag("feature-toggles");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error("Error revalidating feature toggles:", err);
    return NextResponse.json(
      { message: "Error revalidating feature toggles" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // @ts-expect-error - requires 2 arguments in next cache typings
    revalidateTag("feature-toggles");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error("Error revalidating feature toggles:", err);
    return NextResponse.json(
      { message: "Error revalidating feature toggles" },
      { status: 500 }
    );
  }
}
