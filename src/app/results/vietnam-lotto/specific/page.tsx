import VietnamLottoDisplay from "../VietnamLottoDisplay";
import { vietnamLottoData } from "@/data/vietnamData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ตรวจหวยฮานอยเฉพาะกิจ ผลหวยฮานอยวันนี้ | LOTTOX",
  description:
    "ตรวจหวยฮานอยเฉพาะกิจ (Hanoi Specific) อัพเดทผลล่าสุด 16:30 น. ทุกวัน รวดเร็ว แม่นยำ",
};

export default function HanoiSpecificPage() {
  return (
    <VietnamLottoDisplay
      lotteryType="specific"
      data={vietnamLottoData.specific}
    />
  );
}
