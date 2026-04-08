/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const file = '/Users/kvivek/Documents/lottox/src/lib/services/lotteryResultService.ts';
let code = fs.readFileSync(file, 'utf8');
const oldLogic = `  if (dataToUse && typeof dataToUse === "object") {
    const rawData = dataToUse as Record<string, any>;
    if (rawData.unified_result) {
      dataToUse = rawData.unified_result;
    } else if (rawData.lottery_result) {
      dataToUse = rawData.lottery_result;
    }
  }`;
const newLogic = `  if (dataToUse && typeof dataToUse === "object") {
    const rawData = dataToUse as Record<string, any>;
    // Count sources to decide whether to use unified or raw lottery result
    const sourceKeys = Object.keys(rawData).filter(k => k !== 'unified_result' && k !== 'lottery_result' && k !== 'metadata' && k !== 'updatedAt' && k !== 'createdAt');
    const hasMultipleSources = sourceKeys.length > 1;

    if (hasMultipleSources && rawData.unified_result) {
      dataToUse = rawData.unified_result;
    } else if (rawData.lottery_result) {
      dataToUse = rawData.lottery_result;
    } else if (rawData.unified_result) {
      dataToUse = rawData.unified_result;
    }
  }`;
if (code.includes(oldLogic)) {
  fs.writeFileSync(file, code.replace(oldLogic, newLogic));
  console.log("Patched lotteryResultService.ts");
} else {
  console.log("Could not find exact logic to patch");
}
