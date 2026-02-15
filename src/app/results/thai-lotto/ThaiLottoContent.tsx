"use client";

import { LotteryBall } from "@/components/ui/LotteryBall";
import { getFlagUrl } from "@/lib/flags";
import { ShieldCheck, Trophy, Clock, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { newsArticles } from "@/lib/newsData";
import { SubscribeButton } from "@/components/ui/SubscribeButton";

/* ── SVG Search Icon ── */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/* ── SVG Newspaper Icon ── */
function NewspaperIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}

/* ── Mock data ── */
const latestDraw = {
  date: "1 กุมภาพันธ์ 2569",
  drawNo: "#39/2569",
  daysAgo: "3 วันที่แล้ว",
  firstPrize: "174629",
  firstPrizeAmount: "6,000,000",
  front3: ["917", "195"],
  front3Amount: "4,000",
  back3: ["408", "041"],
  back3Amount: "4,000",
  last2: "48",
  last2Amount: "2,000",
  adjacent: ["174628", "174630"],
  adjacentAmount: "100,000",
  prize2: ["048036", "374502", "602910", "679914", "889775"],
  prize2Amount: "200,000",
  prize3: [
    "145551",
    "167591",
    "216443",
    "236455",
    "319246",
    "428751",
    "479569",
    "586374",
    "592665",
    "893288",
  ],
  prize3Amount: "80,000",
  prize4: [
    "004427",
    "242652",
    "266256",
    "297562",
    "391432",
    "538731",
    "613010",
    "695755",
    "771134",
    "839220",
    "048178",
    "242893",
    "275320",
    "326375",
    "407126",
    "542764",
    "630109",
    "710588",
    "796321",
    "866166",
    "192972",
    "246525",
    "282059",
    "328346",
    "423483",
    "600759",
    "633827",
    "718890",
    "804105",
    "870519",
    "208769",
    "247143",
    "287243",
    "350883",
    "427968",
    "604778",
    "651287",
    "736797",
    "808594",
    "963842",
    "241852",
    "249030",
    "287292",
    "377600",
    "469942",
    "609198",
    "655598",
    "755949",
    "811271",
    "993587",
  ],
  prize4Amount: "40,000",
  prize5: [
    "000575",
    "054754",
    "225058",
    "296996",
    "383514",
    "476748",
    "562923",
    "664084",
    "768482",
    "874265",
    "001748",
    "069035",
    "237806",
    "299277",
    "383649",
    "493820",
    "591145",
    "674634",
    "795361",
    "891763",
    "004032",
    "089447",
    "251893",
    "306934",
    "393701",
    "529898",
    "618658",
    "678358",
    "798378",
    "892661",
    "005170",
    "090116",
    "260267",
    "307310",
    "396449",
    "532159",
    "632552",
    "681109",
    "817156",
    "902162",
    "015930",
    "103304",
    "260592",
    "312009",
    "423344",
    "537830",
    "632576",
    "681325",
    "832668",
    "927213",
    "028288",
    "103742",
    "264668",
    "337975",
    "426735",
    "539052",
    "634513",
    "688316",
    "835232",
    "944716",
    "036929",
    "118346",
    "266525",
    "363371",
    "454523",
    "544055",
    "635894",
    "736785",
    "841210",
    "958247",
    "039168",
    "120536",
    "268024",
    "378697",
    "472821",
    "544162",
    "642707",
    "752340",
    "845518",
    "961591",
    "049866",
    "211832",
    "271442",
    "379999",
    "473151",
    "560604",
    "649677",
    "764377",
    "865332",
    "969437",
    "054311",
    "222763",
    "274462",
    "380022",
    "475522",
    "560970",
    "651872",
    "764459",
    "867328",
    "983524",
  ],
  prize5Amount: "20,000",
};

const recentResults = [
  {
    date: "16 เม.ย. 67",
    firstPrize: "435580",
    last3f: "238",
    last3b: "469",
    last2: "80",
  },
  {
    date: "1 เม.ย. 67",
    firstPrize: "633792",
    last3f: "238",
    last3b: "792",
    last2: "92",
  },
  {
    date: "16 มี.ค. 67",
    firstPrize: "236285",
    last3f: "362",
    last3b: "285",
    last2: "85",
  },
  {
    date: "1 มี.ค. 67",
    firstPrize: "091203",
    last3f: "912",
    last3b: "203",
    last2: "03",
  },
];

/* ── Components ── */
function PrizeGrid({
  numbers,
  columns = 5,
}: {
  numbers: string[];
  columns?: number;
}) {
  return (
    <div
      className="grid gap-px"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {numbers.map((num, i) => {
        const rowIndex = Math.floor(i / columns);
        const isZebraRow = rowIndex % 2 === 1;
        return (
          <div
            key={i}
            className={`px-2 py-3 text-center font-mono text-xl tabular-nums tracking-widest text-gray-200 transition-colors hover:bg-gold-500/10 hover:text-gold-300 ${isZebraRow ? "bg-white/[0.03]" : ""}`}
            style={{ fontWeight: 600 }}
          >
            {num}
          </div>
        );
      })}
    </div>
  );
}

function PrizeSectionHeader({
  title,
  count,
  amount,
}: {
  title: string;
  count: number;
  amount: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-2 border-b border-gold-500/20 bg-gradient-to-r from-gold-500/10 to-transparent px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <h3 className="text-xl font-bold text-gold-400">{title}</h3>
      <div className="text-sm text-gray-400">
        {count} รางวัล {t.common.perPrize}{" "}
        <span className="font-bold text-gold-300">
          {amount} {t.common.baht}
        </span>
      </div>
    </div>
  );
}

/* ── Main Content ── */
export default function ThaiLottoContent() {
  const { t, language } = useLanguage();
  const sidebarNews = newsArticles.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header + GLO Logo */}
      <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-green-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> {t.header.verified}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">
              <img
                src={getFlagUrl("TH")}
                alt="Thailand flag"
                className="mr-1.5 inline-block h-4 w-6 rounded-sm"
              />
              {t.lottery.thai.country}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/21/GLO_Logo.svg"
              alt="GLO"
              className="h-10 w-auto brightness-0 invert opacity-80"
            />
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {t.lottery.thai.name}
              </h1>
              <p className="text-xs text-gray-500">{t.lottery.thai.subName}</p>
            </div>
          </div>
        </div>

        <SubscribeButton type="THAI" />
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* SECTION 1: Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 shadow-2xl">
            <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-48 w-48 rounded-full bg-neon-blue/10 blur-3xl" />

            <div className="relative z-10 p-6 sm:p-8">
              <div className="mb-2 text-center text-sm uppercase tracking-widest text-gold-400">
                {t.lottery.thai.subName}
              </div>
              <div className="mb-4 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-4">
                  <img
                    src={getFlagUrl("TH")}
                    alt="Thailand flag"
                    className="inline-block h-10 w-10"
                  />
                  <h2 className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-sm sm:text-6xl text-center leading-tight">
                    {t.lottery.thai.name}
                  </h2>
                </div>
              </div>
              <div className="mb-8 text-center text-sm text-gray-400">
                {t.common.date} {latestDraw.date} | {latestDraw.drawNo} |{" "}
                {latestDraw.daysAgo}
              </div>

              {/* 1st Prize */}
              <div className="mb-8">
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/15 px-5 py-2 text-sm font-bold uppercase tracking-wider text-gold-400">
                    <Trophy className="h-4 w-4" />
                    {t.results.prize1} ({t.common.perPrize}{" "}
                    <span className="text-white ml-1">
                      {latestDraw.firstPrizeAmount} {t.common.baht})
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  {latestDraw.firstPrize.split("").map((n, i) => (
                    <LotteryBall
                      key={i}
                      number={n}
                      size="lg"
                      color="gold"
                      className="h-16 w-16 text-4xl font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] sm:h-20 sm:w-20 sm:text-5xl"
                    />
                  ))}
                </div>
              </div>

              {/* 3-digit / 2-digit / adjacent */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-navy-800/60 p-5 text-center transition-transform hover:scale-105">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {t.results.prize3Front}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {latestDraw.front3.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-2xl font-bold tracking-widest text-white"
                      >
                        {num}
                      </span>
                    ))}
                    <span className="mt-1 text-[10px] text-gold-400">
                      {latestDraw.front3Amount} {t.common.baht}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-navy-800/60 p-5 text-center transition-transform hover:scale-105">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {t.results.prize3Back}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {latestDraw.back3.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-2xl font-bold tracking-widest text-white"
                      >
                        {num}
                      </span>
                    ))}
                    <span className="mt-1 text-[10px] text-gold-400">
                      {latestDraw.back3Amount} {t.common.baht}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-gold-500/20 bg-navy-800/60 p-5 text-center transition-transform hover:scale-105">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gold-400">
                    {t.results.prize2}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-mono text-4xl font-bold tracking-widest text-gold-400">
                      {latestDraw.last2}
                    </span>
                    <span className="mt-1 text-[10px] text-white">
                      {latestDraw.last2Amount} {t.common.baht}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-navy-800/60 p-5 text-center transition-transform hover:scale-105">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {t.common.adjacent}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {latestDraw.adjacent.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-lg font-bold tracking-widest text-white sm:text-lg"
                      >
                        {num}
                      </span>
                    ))}
                    <span className="mt-1 text-[10px] text-gold-400">
                      {latestDraw.adjacentAmount} {t.common.baht}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2-5: Prize Grids */}
          {[
            {
              title: t.results.prize2rank,
              count: 5,
              amount: latestDraw.prize2Amount,
              numbers: latestDraw.prize2,
            },
            {
              title: t.results.prize3rank,
              count: 10,
              amount: latestDraw.prize3Amount,
              numbers: latestDraw.prize3,
            },
            {
              title: t.results.prize4rank,
              count: 50,
              amount: latestDraw.prize4Amount,
              numbers: latestDraw.prize4,
            },
            {
              title: t.results.prize5rank,
              count: 100,
              amount: latestDraw.prize5Amount,
              numbers: latestDraw.prize5,
            },
          ].map((prize, i) => (
            <section
              key={i}
              className="overflow-hidden rounded-xl border border-white/10 bg-navy-900/50"
            >
              <PrizeSectionHeader
                title={prize.title}
                count={prize.count}
                amount={prize.amount}
              />
              <PrizeGrid numbers={prize.numbers} columns={5} />
            </section>
          ))}

          {/* SECTION 6: Lottery Checker (UPDATED) */}
          <section className="rounded-xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-lg font-bold text-white">
              {t.common.checkResult}
            </h3>
            <div className="flex flex-col gap-4 md:flex-row">
              <select className="flex-1 rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-white outline-none focus:border-gold-500">
                <option>{t.common.selectType}</option>
              </select>
              <div className="relative flex-[2]">
                <input
                  type="text"
                  placeholder={t.common.inputPlaceholder}
                  className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-white outline-none focus:border-gold-500"
                />
              </div>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-8 py-3 font-bold text-black transition-all hover:bg-gold-400 hover:scale-105">
                <SearchIcon className="h-5 w-5" />
                {t.common.checkBtn}
              </button>
            </div>
          </section>

          {/* SECTION 7: Past Results */}
          <section className="overflow-hidden rounded-xl border border-white/10 bg-navy-900/50">
            <div className="border-b border-white/10 px-6 py-4">
              <h3 className="font-bold text-white">{t.results.history}</h3>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t.common.date}</th>
                    <th className="px-4 py-3 font-medium">
                      {t.results.prize1}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t.results.prize3Front}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t.results.prize3Back}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t.results.prize2}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentResults.map((row, i) => (
                    <tr
                      key={i}
                      className={`group hover:bg-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                    >
                      <td className="px-4 py-4 font-mono text-sm tabular-nums text-gray-400">
                        {row.date}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-mono text-xl font-bold tracking-[0.3em] text-white">
                          {row.firstPrize}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded border border-blue-500/20 bg-blue-500/20 px-2 py-0.5 font-mono text-lg font-bold tracking-widest text-blue-300">
                          {row.last3f}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded border border-blue-500/20 bg-blue-500/20 px-2 py-0.5 font-mono text-lg font-bold tracking-widest text-blue-300">
                          {row.last3b}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded border border-gold-500/20 bg-gold-500/20 px-2 py-0.5 font-mono text-lg font-bold tracking-widest text-gold-400">
                          {row.last2}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="divide-y divide-white/5 lg:hidden">
              {recentResults.map((row, i) => (
                <div
                  key={i}
                  className={`space-y-3 px-5 py-4 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={getFlagUrl("TH")}
                        alt="TH"
                        className="h-4 w-6 rounded-sm"
                      />
                      <span className="text-sm font-medium text-white">
                        Thai Lotto
                      </span>
                    </div>
                    <span className="font-mono text-xs text-gray-500">
                      {row.date}
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                      {t.results.prize1}
                    </div>
                    <div className="font-mono text-2xl font-bold tracking-[0.3em] text-white">
                      {row.firstPrize}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[30%]">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.prize3Front}
                      </div>
                      <span className="block w-full rounded border border-blue-500/20 bg-blue-500/20 px-2 py-1 font-mono text-lg font-bold text-blue-300 text-center">
                        {row.last3f}
                      </span>
                    </div>
                    <div className="flex-1 min-w-[30%]">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.prize3Back}
                      </div>
                      <span className="block w-full rounded border border-blue-500/20 bg-blue-500/20 px-2 py-1 font-mono text-lg font-bold text-blue-300 text-center">
                        {row.last3b}
                      </span>
                    </div>
                    <div className="flex-1 min-w-[30%]">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
                        {t.results.prize2}
                      </div>
                      <span className="block w-full rounded border border-gold-500/20 bg-gold-500/20 px-2 py-1 font-mono text-lg font-bold text-gold-400 text-center">
                        {row.last2}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 8: Disclaimer (Placeholder text not in dictionary, skipping or keeping hardcoded is usually fine for legal text, but better to translate. Using hardcoded Thai as fallback since I didn't add it) */}
          <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <p className="text-sm leading-relaxed text-gray-300">
                ข้อมูลผลรางวัลเป็นเพียงการนำเสนอเพื่ออำนวยความสะดวก
                โปรดตรวจสอบกับสำนักงานสลากกินแบ่งรัฐบาลอีกครั้งเพื่อความถูกต้อง
              </p>
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar) */}
        <aside className="space-y-6">
          {/* Sidebar: Lottery Checker (UPDATED) */}
          <div className="rounded-xl border border-gold-500/20 bg-navy-800/30 p-6">
            <h3 className="mb-4 text-center text-lg font-bold text-gold-400">
              {t.common.checkTicket}
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.common.inputPlaceholder1}
                  className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-center text-lg text-white outline-none focus:border-gold-500"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.common.inputPlaceholder2}
                  className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-center text-lg text-white outline-none focus:border-gold-500"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.common.inputPlaceholder3}
                  className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-center text-lg text-white outline-none focus:border-gold-500"
                />
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 py-3 text-lg font-bold text-black transition-all hover:scale-105 hover:bg-gold-400">
                <SearchIcon className="h-5 w-5" />
                {t.common.checkBtn}
              </button>
            </div>
          </div>

          {/* Sidebar: News with images */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-800/30">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <NewspaperIcon className="h-4 w-4 text-gold-400" />
              <h3 className="text-lg font-bold text-white">
                {t.common.newsTitle}
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {sidebarNews.map((news, i) => (
                <Link
                  key={i}
                  href={`/news/${news.slug}`}
                  className={`flex gap-3 px-4 py-4 transition-colors hover:bg-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={news.image}
                      alt={language === "th" ? news.title : news.titleEn}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <span className="mb-1 inline-block rounded bg-gold-500/10 px-1.5 py-0.5 text-xs font-semibold text-gold-400 w-fit">
                      {language === "th" ? news.category : news.categoryEn}
                    </span>
                    <h4 className="text-sm font-bold text-gray-200 line-clamp-2 leading-snug">
                      {language === "th" ? news.title : news.titleEn}
                    </h4>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                      <Clock className="h-3 w-3" />
                      {news.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar: Stats */}
          <div className="rounded-xl border border-white/10 bg-navy-800/30 p-6">
            <h3 className="mb-4 text-lg font-bold text-white">
              {t.common.stats}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-base">
                <span className="text-gray-400">{t.common.nextDraw}</span>
                <span className="font-bold text-gold-400">
                  16 ก.พ. 69 - 14:30 น.
                </span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-400">{t.common.odds}</span>
                <span className="text-white">1 ใน 1,000,000</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-400">{t.common.totalPrize}</span>
                <span className="text-white">~72 ล้านบาท/งวด</span>
              </div>
            </div>
          </div>

          {/* Sidebar: Past draw links */}
          <div className="rounded-xl border border-white/10 bg-navy-800/30 p-6">
            <h3 className="mb-4 text-lg font-bold text-white">
              {t.common.historyTitle}
            </h3>
            <div className="space-y-2">
              {[
                "งวด 16 ก.พ. 69",
                "งวด 1 ก.พ. 69",
                "งวด 17 ม.ค. 69",
                "งวด 30 ธ.ค. 68",
              ].map((text, i) => (
                <Link
                  key={i}
                  href="#"
                  className="block rounded bg-white/5 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-gold-400"
                >
                  {text}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
