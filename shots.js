/* Screenshot the tools at phone and laptop size, light and dark. */
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "shots");
const BASE = "http://localhost:8099";

const PAGES = [
  { name: "toolbox", url: "/" },
  { name: "level-test", url: "/business-level-test/" },
  { name: "cost", url: "/cost-of-repeating/" },
  { name: "audit", url: "/dependency-audit/" }
];

// budget Android, then a laptop
const SIZES = [
  { name: "phone", width: 360, height: 740, dsf: 3, mobile: true },
  { name: "laptop", width: 1280, height: 800, dsf: 1, mobile: false }
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: "C:/Users/Administrator/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe"
  });

  for (const size of SIZES) {
    for (const scheme of ["light", "dark"]) {
      const ctx = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        deviceScaleFactor: size.dsf,
        isMobile: size.mobile,
        hasTouch: size.mobile,
        colorScheme: scheme
      });
      const page = await ctx.newPage();

      for (const p of PAGES) {
        await page.goto(BASE + p.url, { waitUntil: "networkidle" });

        // intro screen
        await page.screenshot({
          path: path.join(OUT, `${p.name}-${size.name}-${scheme}-1-intro.png`)
        });

        if (p.name !== "toolbox") {
          await page.click("#go");
          await page.waitForTimeout(150);
          await page.screenshot({
            path: path.join(OUT, `${p.name}-${size.name}-${scheme}-2-question.png`)
          });

          // drive to the result
          if (p.name === "cost") {
            for (const v of [40, 10, 400000, 60]) {
              await page.fill("#v", String(v));
              await page.click("#next");
              await page.waitForTimeout(120);
            }
          } else if (p.name === "level-test") {
            const lv = await page.evaluate(() => window.CFG.questions.map(q => q.lv));
            for (const l of lv) { await page.click(l <= 2 ? "#y" : "#n"); await page.waitForTimeout(60); }
          } else {
            for (let k = 0; k < 15; k++) { await page.click(k < 6 ? "#y" : "#n"); await page.waitForTimeout(60); }
          }
          await page.waitForTimeout(200);
          await page.screenshot({
            path: path.join(OUT, `${p.name}-${size.name}-${scheme}-3-result.png`)
          });
        }
      }
      await ctx.close();
    }
  }

  await browser.close();
  const files = fs.readdirSync(OUT);
  console.log(files.length + " screenshots written to " + OUT);
})();
