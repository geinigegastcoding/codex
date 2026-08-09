import { test, expect } from "@playwright/test";

test("the signal loop stays short and editable", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.getByRole("heading", { name: "The useful part of today." })).toBeVisible();
  await expect(page.locator('[data-testid="story-card"]')).toHaveCount(6);

  await page.locator('[data-story="ecb-cut"] [data-action="open-story"]').click();
  await expect(page.locator("[data-drawer-panel]")).toBeVisible();
  await expect(page.locator("[data-drawer-panel]").getByRole("heading", { name: "ECB cuts rates by 25 basis points" })).toBeVisible();
  await page.locator('[data-drawer-panel] [data-action="feedback"][data-feedback="more"]').click();
  await expect(page.getByText("Sift will look for more of this signal.")).toBeVisible();
  await page.locator('[data-drawer-panel] [data-action="close-drawer"]').click();

  await page.locator('[data-route="profile"]').first().click();
  await expect(page.getByRole("heading", { name: "Your interest profile." })).toBeVisible();
  await page.locator('[data-action="change-strength"][data-rule="nvidia"][data-delta="1"]').click();
  await expect(page.getByText("Nvidia is now high.")).toBeVisible();

  await page.locator('[data-route="explore"]').first().click();
  await page.locator("[data-search]").fill("OpenAI");
  await expect(page.getByText("OpenAI releases a new reasoning model")).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("all primary product screens render", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("http://127.0.0.1:4173/");
  const screens = [
    ["home", "The useful part of today."],
    ["explore", "Follow the questions behind the headlines."],
    ["saved", "Saved for a calmer moment."],
    ["profile", "Your interest profile."],
    ["alerts", "Alerts with a reason."],
    ["sources", "Choose where your signal comes from."],
  ];

  for (const [route, heading] of screens) {
    await page.locator(`[data-route="${route}"]`).first().click();
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
  expect(pageErrors).toEqual([]);
});
