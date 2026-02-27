// eslint-disable-next-line @typescript-eslint/no-require-imports
const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/thailand/thai-lotto", {
    waitUntil: "networkidle0",
  });
  const content = await page.$eval("#debug-dump-lotto", (el) => el.textContent);
  console.log("DUMP:", content);
  await browser.close();
})();
