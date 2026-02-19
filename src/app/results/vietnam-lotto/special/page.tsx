import VietnamLottoDisplay from "../VietnamLottoDisplay";
import { vietnamLottoData } from "@/data/vietnamData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ตรวจหวยฮานอยพิเศษ ผลหวยฮานอยวันนี้ | LOTTOX",
  description:
    "ตรวจหวยฮานอยพิเศษ (Hanoi Special) อัพเดทผลล่าสุด 17:30 น. ทุกวัน รวดเร็ว แม่นยำ",
};

export default function HanoiSpecialPage() {
  return (
    <VietnamLottoDisplay
      lotteryType="special"
      data={vietnamLottoData.special}
    />
  );
}
