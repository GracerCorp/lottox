import { AIContent } from './api-types';

export const generateAiContent = (countryName: string, lotteryName: string, dateDisplay: string = "recently"): AIContent => {
  return {
    summary: `The latest ${lotteryName} draw from ${countryName} took place ${dateDisplay}. Check out the latest winning numbers and prize breakdowns.`,
    faqs: [
      {
        question: `What were the winning numbers for the last ${lotteryName} draw?`,
        answer: `The winning numbers for the most recent draw are displayed above.`
      },
      {
        question: `How can I check past ${lotteryName} results?`,
        answer: `You can view historical ${lotteryName} results by selecting past dates from the results history section on this page.`
      },
      {
        question: `When is the next ${lotteryName} draw?`,
        answer: `Please refer to the official ${countryName} lottery schedule for the upcoming draw dates.`
      }
    ],
    trends: `Track the latest trends for ${lotteryName} to see which numbers are drawn most frequently in ${countryName}.`,
    seoTitle: `${lotteryName} Results Today - ${countryName} Lottery | Winning Numbers`,
    seoDescription: `Check the latest ${lotteryName} winning numbers, payouts, and prize breakdowns for ${countryName}.`
  };
};

export const mockAiContent: AIContent = {
  summary: "The latest USA Powerball draw on April 23, 2026, resulted in a rollover, with no ticket matching all 6 numbers. The jackpot has now swelled to an estimated $450 Million. The winning numbers were 12, 34, 45, 56, 67, and the Powerball was 10. The Power Play multiplier was 2x.",
  faqs: [
    {
      question: "What were the winning numbers for the last USA Powerball draw?",
      answer: "The winning numbers for the most recent draw were 12, 34, 45, 56, 67, with a Powerball of 10."
    },
    {
      question: "Did anyone win the jackpot?",
      answer: "No, there were no jackpot winners in this draw. The jackpot has rolled over to the next draw."
    },
    {
      question: "What is the estimated jackpot for the next draw?",
      answer: "The estimated jackpot for the next USA Powerball draw is $450 Million."
    }
  ],
  trends: "This draw marks the 15th consecutive rollover since the last jackpot was won. The number 45 has appeared in 3 of the last 10 draws, making it a currently 'hot' number. Conversely, the number 22 hasn't been drawn in over 30 draws.",
  seoTitle: "USA Powerball Results Today - April 23, 2026 | Winning Numbers",
  seoDescription: "Check the latest USA Powerball winning numbers, payouts, and prize breakdowns for April 23, 2026. The estimated jackpot is $450 Million."
};
