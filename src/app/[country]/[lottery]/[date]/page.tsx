import { DrawResult } from "@/components/lottery/DrawResult";
import { notFound } from "next/navigation";
import { useApi } from "@/lib/hooks/useApi"; // Note: simple import, but this is server component

// Note: For Server Components we cannot use the custom hook directly if it uses client-side logic (useState/useEffect)
// We should fetch data directly or use a client component wrapper.
// Since `DrawResult` is a client component (marked "use client"), we can just fetch data here or make this a client page.
// for simplicity and consistency with the previous page, let's make this page a client component wrapper or just fetch here if possible.
// Actually, `useApi` is likely client-side. Let's make a Client Component for the content.

import DrawDetailContent from "./DrawDetailContent";

interface PageProps {
  params: Promise<{
    country: string;
    lottery: string;
    date: string;
  }>;
}

export default async function DrawPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { country, lottery, date } = resolvedParams;

  return <DrawDetailContent country={country} lottery={lottery} date={date} />;
}
