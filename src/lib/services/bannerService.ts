import { prisma } from "@/lib/prisma";

export async function getActiveBanners() {
  try {
    return await prisma.banners.findMany({
      where: { is_active: true },
      select: {
        id: true,
        image_url: true,
        lottery_results: {
          select: {
            lottery: {
              select: {
                name: true,
                countries: {
                  select: {
                    name: true,
                    code: true,
                    draw_schedule: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch active banners:", error);
    return [];
  }
}
