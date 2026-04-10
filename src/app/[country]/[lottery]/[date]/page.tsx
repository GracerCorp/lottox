import LotteryDetail from "@/components/lottery/LotteryDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLotteryBySlug } from "@/lib/services/lotteryService";
import { Breadcrumb, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { LotteryResultJsonLd } from "@/components/seo/LotteryResultJsonLd";
import { getDictionary } from "@/lib/i18n";

interface PageProps {
  params: Promise<{
    country: string;
    lottery: string;
    date: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { country, lottery, date } = await params;
  const data = await getLotteryBySlug(country, lottery);

  const lotteryName =
    data?.lottery.name || lottery.replace(/-/g, " ").toUpperCase();
  const countryName = data?.country.name || country;

  return {
    title: `${lotteryName} Results - ${date} - ${countryName} Lottery | LOTTOX`,
    description: `Results for ${lotteryName} on ${date} from ${countryName}. Check winning numbers and prize breakdowns.`,
    alternates: {
      canonical: `/${country}/${lottery}/${date}`,
      languages: {
        en: `/${country}/${lottery}/${date}`,
        th: `/${country}/${lottery}/${date}`,
      },
    },
  };
}

export default async function DrawPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { country, lottery, date } = resolvedParams;

  const data = await getLotteryBySlug(country, lottery);

  if (!data) {
    notFound();
  }

  const { country: countryInfo, lottery: lotteryInfo, apiType } = data;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: countryInfo.name, href: `/${country}` },
    { label: lotteryInfo.name, href: `/${country}/${lottery}` },
    { label: date },
  ];

  const dict = await getDictionary("en");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = (dict as any)?.results ?? {};
  const prizeLabels = {
    firstPrize: r.prize1 ?? "1st Prize",
    last3f: r.prize3Front ?? "3 Front",
    last3b: r.prize3Back ?? "3 Back",
    last2: r.prize2 ?? "2 Bottom",
  };

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <LotteryResultJsonLd
        lotteryName={lotteryInfo.name}
        countryName={countryInfo.name}
        drawDate={date}
        currency={lotteryInfo.currency ?? undefined}
        url={`https://lottox.today/${country}/${lottery}/${date}`}
      />
      <div className="container mx-auto px-4 pt-4 relative z-50">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <LotteryDetail
        country={countryInfo.name}
        countryCode={countryInfo.code}
        lotteryName={lotteryInfo.name}
        lotteryId={lotteryInfo.id}
        lotterySlug={lottery}
        apiEndpoint={`/api/results/${apiType}/${date}`}
        logo={lotteryInfo.logo}
        currency={lotteryInfo.currency}
        howToPlayText={lotteryInfo.how_to_play_text}
        howToPlayImage={lotteryInfo.how_to_play_image}
        prizeLabels={prizeLabels}
        hideVerification={true}
      />
    </>
  );
}
