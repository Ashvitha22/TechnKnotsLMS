import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:8080";
const screenshotPath = process.argv[3] ?? "tmp/page.png";

const main = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on("console", (msg) => {
    console.log(`[browser:${msg.type()}] ${msg.text()}`);
  });

  page.on("pageerror", (error) => {
    console.error(`[browser:pageerror] ${error.message}\n${error.stack}`);
  });

  try {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Saved screenshot to ${screenshotPath}`);
  } finally {
    await browser.close();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

