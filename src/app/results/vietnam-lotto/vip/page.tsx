import VietnamLottoDisplay from "../VietnamLottoDisplay";
import { vietnamLottoData } from "@/data/vietnamData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ตรวจหวยฮานอยวีไอพี ผลหวยฮานอยวันนี้ | LOTTOX",
  description:
    "ตรวจหวยฮานอยวีไอพี (Hanoi VIP) อัพเดทผลล่าสุด 19:30 น. ทุกวัน รวดเร็ว แม่นยำ",
};

export default function HanoiVIPPage() {
  return <VietnamLottoDisplay lotteryType="vip" data={vietnamLottoData.vip} />;
}
