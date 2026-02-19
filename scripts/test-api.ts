import "dotenv/config"; // Try to load .env
import { apiClient } from "../src/lib/api-client";

async function test() {
  console.log("Testing API Client...");
  console.log("API_KEY present:", !!process.env.API_KEY);
  if (process.env.API_KEY) {
    console.log("API_KEY length:", process.env.API_KEY.length);
    console.log("API_KEY start:", process.env.API_KEY.substring(0, 5));
  }

  try {
    const results = await apiClient.getLatestResults();
    console.log("Latest Results:", JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Test Failed:", error);
  }
}

test();
