import VietnamLottoDisplay from "../VietnamLottoDisplay";
import { vietnamLottoData } from "@/data/vietnamData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ตรวจหวยฮานอยปกติ ผลหวยฮานอยวันนี้ | LOTTOX",
  description:
    "ตรวจหวยฮานอยปกติ (Hanoi Normal) อัพเดทผลล่าสุด 18:30 น. ทุกวัน รวดเร็ว แม่นยำ",
};

export default function HanoiNormalPage() {
  return (
    <VietnamLottoDisplay lotteryType="normal" data={vietnamLottoData.normal} />
  );
}
