import { prisma } from "@/lib/prisma";

export async function getActiveBanners() {
  return await prisma.banners.findMany({
    where: { is_active: true },
    include: {
      lottery_results: {
        include: {
          lottery: {
            include: {
              countries: true,
            },
          },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
}
