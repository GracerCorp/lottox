"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { vietnamLottoData } from "@/data/vietnamData";
import Link from "next/link";
import { getFlagUrl } from "@/lib/flags";
import { ShieldCheck, Calendar, ArrowRight } from "lucide-react";

function LotteryCard({
  type,
  data,
}: {
  type: keyof typeof vietnamLottoData;
  data: any;
}) {
  const { t } = useLanguage();
  const info = t.lottery.vietnam[type];

  return (
    <Link
      href={`/results/vietnam-lotto/${type}`}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-navy-800/50 p-6 transition-all hover:border-red-500/50 hover:bg-navy-800/80 hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
            <img
              src={getFlagUrl("vn")}
              alt="Vietnam"
              className="h-6 w-6 object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{info.name}</h3>
            <p className="text-xs text-gray-400">{info.subName}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Next Draw</div>
          <div className="font-mono text-red-400 font-bold">{info.time}</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">งวดวันที่</span>
          <span className="text-white font-mono">{data.latest.date}</span>
        </div>
        <div className="p-3 bg-navy-900/50 rounded-lg flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            รางวัลพิเศษ
          </span>
          <span className="font-mono text-2xl font-bold text-red-500 tracking-widest">
            {data.latest.digit4}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 bg-navy-900/50 rounded-lg text-center">
            <div className="text-[10px] text-gray-500 uppercase">3 ตัวบน</div>
            <div className="font-mono text-lg font-bold text-white">
              {data.latest.digit3}
            </div>
          </div>
          <div className="p-2 bg-navy-900/50 rounded-lg text-center">
            <div className="text-[10px] text-gray-500 uppercase">2 ตัวล่าง</div>
            <div className="font-mono text-lg font-bold text-white">
              {data.latest.digit2}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-red-400 opacity-0 transition-opacity group-hover:opacity-100">
        ดูผลรางวัล <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

export default function VietnamLottoPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400 mb-4">
          <ShieldCheck className="h-4 w-4" />
          {t.header.verified}
        </div>
        <h1 className="text-3xl font-bold text-white md:text-5xl mb-4">
          {t.lottery.vietnam.name}
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {t.staticParams.vietnamDetails.desc}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LotteryCard type="specific" data={vietnamLottoData.specific} />
        <LotteryCard type="special" data={vietnamLottoData.special} />
        <LotteryCard type="normal" data={vietnamLottoData.normal} />
        <LotteryCard type="vip" data={vietnamLottoData.vip} />
      </div>

      <div className="mt-12 rounded-2xl border border-white/10 bg-navy-900/50 p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-4">
          ทำไมต้องตรวจหวยฮานอยกับเรา?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="p-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-400 mx-auto mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-white mb-2">เชื่อถือได้ 100%</h4>
            <p className="text-sm text-gray-400">
              ข้อมูลนำมาจากแหล่งออกรางวัลที่ถูกต้องและแม่นยำที่สุด
            </p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mx-auto mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-white mb-2">อัพเดททุกวัน</h4>
            <p className="text-sm text-gray-400">
              ผลออกปุ๊บ รู้ปั๊บ รวดเร็วทันใจ พร้อมแจ้งเตือน
            </p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 mx-auto mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-white mb-2">ดูย้อนหลังได้</h4>
            <p className="text-sm text-gray-400">
              เช็คสถิติและผลหวยย้อนหลังได้ง่ายๆ ตลอด 24 ชม.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
