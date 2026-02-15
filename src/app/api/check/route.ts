import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("number");
  const type = searchParams.get("type"); // THAI or LAO

  if (!number || !type) {
    return NextResponse.json(
      { error: "Missing number or type" },
      { status: 400 },
    );
  }

  try {
    // Get the latest result for the type
    const result = await prisma.lotteryResult.findFirst({
      where: { type: type.toUpperCase() },
      orderBy: { drawDate: "desc" },
    });

    if (!result) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    const data = JSON.parse(result.data);
    let win = false;
    let prize = "";
    let amount = "";

    if (type.toUpperCase() === "THAI") {
      if (data.first === number) {
        win = true;
        prize = "prize1";
        amount = "6,000,000";
      } else if (data.last2 === number.slice(-2)) {
        win = true;
        prize = "prize2";
        amount = "2,000";
      } else if (data.last3f && data.last3f.includes(number.slice(0, 3))) {
        win = true;
        prize = "prize3Front";
        amount = "4,000";
      } else if (data.last3b && data.last3b.includes(number.slice(-3))) {
        win = true;
        prize = "prize3Back";
        amount = "4,000";
      }
      // Add more checks as needed
    } else if (type.toUpperCase() === "LAO") {
      // Lao logic
      if (data.digit4 === number) {
        win = true;
        prize = "digit4";
        amount = "6,000x";
      } else if (data.digit3 === number.slice(-3)) {
        win = true;
        prize = "digit3";
        amount = "500x";
      } else if (data.digit2 === number.slice(-2)) {
        win = true;
        prize = "digit2";
        amount = "60x";
      }
    }

    return NextResponse.json({
      win,
      prize,
      amount,
      drawDate: result.date,
      drawNo: result.drawNo,
    });
  } catch (error) {
    console.error("Check API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
