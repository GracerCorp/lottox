import { z } from 'zod';
import { Redis } from '@upstash/redis';
import { AIContent } from '../api-types';

// Initialize Redis if URL and Token are provided in env, else we can mock or fallback
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({
  url: redisUrl,
  token: redisToken,
}) : null;

// Define the schema that the AI should return
const aiContentSchema = z.object({
  summary: z.string().describe("A summary of the latest lottery draw, including numbers drawn, jackpot status, and general info."),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).describe("3 frequently asked questions and answers about this specific lottery draw."),
  trends: z.string().describe("A brief analysis of number trends, hot/cold numbers, or consecutive rollovers based on the results."),
  seoTitle: z.string().describe("An SEO optimized title for the results page."),
  seoDescription: z.string().describe("An SEO optimized meta description for the results page.")
});

export async function generateLotteryInsights(
  countryName: string,
  lotteryName: string,
  latestDateDisplay: string = "recently",
  lotteryId: string,
  rawResultData?: any // We can pass the raw data here if we have it, to give the AI context
): Promise<AIContent> {
  const cacheKey = `ai_content:${lotteryId}:${latestDateDisplay.replace(/[^a-zA-Z0-9]/g, '_')}`;

  // 1. Check Cache
  if (redis) {
    try {
      const cached = await redis.get<AIContent>(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error("Redis Cache Error:", error);
    }
  }

  // 2. Fallback values in case API key is missing or fails
  const fallback: AIContent = {
    summary: `The latest ${lotteryName} draw from ${countryName} took place ${latestDateDisplay}. Check out the latest winning numbers and prize breakdowns.`,
    faqs: [
      { question: `What were the winning numbers for the last ${lotteryName} draw?`, answer: `The winning numbers for the most recent draw are displayed above.` },
      { question: `How can I check past ${lotteryName} results?`, answer: `You can view historical ${lotteryName} results by selecting past dates from the results history section on this page.` },
      { question: `When is the next ${lotteryName} draw?`, answer: `Please refer to the official ${countryName} lottery schedule for the upcoming draw dates.` }
    ],
    trends: `Track the latest trends for ${lotteryName} to see which numbers are drawn most frequently in ${countryName}.`,
    seoTitle: `${lotteryName} Results Today - ${countryName} Lottery | Winning Numbers`,
    seoDescription: `Check the latest ${lotteryName} winning numbers, payouts, and prize breakdowns for ${countryName}.`
  };

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.warn("GOOGLE_GENERATIVE_AI_API_KEY is not set. Using fallback AI content.");
    return fallback;
  }

  // 3. Generate from Gemini
  try {
    const prompt = `You are a lottery expert. Generate a detailed, engaging summary, FAQs, trends, and SEO metadata for the ${lotteryName} lottery in ${countryName}.
The latest draw took place ${latestDateDisplay}.
${rawResultData ? `Here is the raw data for the latest draw: ${JSON.stringify(rawResultData)}. Use this exact data to provide accurate numbers, prizes, and rollover status.` : "Do not make up specific winning numbers if they are not provided, speak generally about checking the results above."}
Write the response in English. Make the summary at least 3 sentences. Keep trends analytical.`;

    const { object } = await generateObject({
      model: google('gemini-1.5-flash-latest'),
      schema: aiContentSchema,
      prompt: prompt,
    });

    const aiContent = object as AIContent;

    // 4. Save to Cache (expire in 7 days to avoid stale data clutter)
    if (redis) {
      try {
        await redis.set(cacheKey, aiContent, { ex: 60 * 60 * 24 * 7 });
      } catch (error) {
        console.error("Redis Cache Save Error:", error);
      }
    }

    return aiContent;
  } catch (error) {
    console.error("Gemini AI Generation Error:", error);
    return fallback;
  }
}
