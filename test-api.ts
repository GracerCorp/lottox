// Removed invalid ApiClient import

async function run() {
  const { apiClient } = await import("./src/lib/services/lotteryResultService");
  try {
    const data = await apiClient.getResultsByType("thai", 10, 0);
    console.log("Success:", data);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
