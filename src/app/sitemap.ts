import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils/lotteryUtils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lottox.today'

  // Fetch active lotteries to link to their country page
  const countries = await prisma.countries.findMany({
    where: { is_active: true },
    include: {
      lotteries: {
        where: { is_active: true }
      }
    }
  })

  // Query some recent results to generate dynamic URLs for past draws
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentResults: any[] = await prisma.lottery_results.findMany({
    take: 1000,
    orderBy: { draw_date: 'desc' },
    include: {
      lottery: {
        include: {
          countries: true
        }
      }
    },
    where: {
      validation_status: 'verified',
      is_published: true,
      lottery: {
        is_active: true,
        countries: {
          is_active: true
        }
      }
    }
  })

  // Basic static routes
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
        url: `${baseUrl}/results`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9,
    },
    {
        url: `${baseUrl}/news`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    },
    {
        url: `${baseUrl}/lottery`,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 0.9,
    },
    {
        url: `${baseUrl}/results_today`,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 0.9,
    },
    {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
    },
    {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
    },
    {
        url: `${baseUrl}/faq`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
    },
    {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
    },
    {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
    },
    {
        url: `${baseUrl}/disclaimer`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
    },
  ]

  // Add country pages & lottery pages
  countries.forEach(country => {
      const countryCode = country.code.toLowerCase();
      sitemap.push({
          url: `${baseUrl}/${countryCode}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.9,
      })

      // Add individual lotteries: /[country]/[lottery]
      country.lotteries.forEach(lottery => {
          sitemap.push({
              url: `${baseUrl}/${countryCode}/${slugify(lottery.name)}`,
              lastModified: new Date(),
              changeFrequency: 'hourly',
              priority: 0.8,
          })
      })
  })

  // Add specific draw dates: /[country]/[lottery]/[date]
  const addedDraws = new Set<string>(); // Prevent adding duplicates if multiple results somehow generated

  recentResults.forEach(result => {
      if (result.lottery && result.lottery.countries) {
          const countryCode = result.lottery.countries.code.toLowerCase();
          
          // Handle potential date objects
          let drawDateStr = '';
          if (result.draw_date instanceof Date) {
              drawDateStr = result.draw_date.toISOString().split('T')[0];
          } else if (typeof result.draw_date === 'string') {
              drawDateStr = result.draw_date.split('T')[0];
          } else {
              drawDateStr = String(result.draw_date); // basic fallback
          }

          const url = `${baseUrl}/${countryCode}/${slugify(result.lottery.name)}/${drawDateStr}`;
          
          if (!addedDraws.has(url)) {
            addedDraws.add(url);
            sitemap.push({
                url: url,
                lastModified: new Date(result.updated_at || result.draw_date),
                changeFrequency: 'weekly',
                priority: 0.6,
            })
          }
      }
  })

  return sitemap;
}
