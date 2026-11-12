import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { emptyAnswers } from "../src/lib/types";

test("home, quiz, refinement, and result meet automated accessibility checks", async ({
  page,
}) => {
  const audit = async () => {
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(
      violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
  };
  await page.goto("/");
  await audit();
  await page
    .getByRole("button", { name: "Find My OS", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: /^PC Windows/ }).click();
  await audit();
  await page.evaluate(
    (answers) =>
      localStorage.setItem(
        "better-tech-v1",
        JSON.stringify({ answers, completed: true, checklist: [] }),
      ),
    {
      ...emptyAnswers,
      device: "pc",
      currentOS: "windows",
      uses: ["gaming"],
      mustHaves: "VALORANT, Unlisted controller",
    },
  );
  await page.reload();
  await page.getByRole("button", { name: "My result", exact: true }).click();
  await audit();
  await page.getByRole("tab", { name: "Compatibility checks" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Hardware & requirements" }),
  ).toBeFocused();
  await audit();
  await page.getByRole("button", { name: "Refine my results" }).click();
  for (let step = 0; step < 9; step++) {
    await audit();
    if (step < 8)
      await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
});

test("layouts fit small phones, tablets, laptops, and wide screens", async ({
  page,
}) => {
  for (const width of [320, 375, 768, 820, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `home at ${width}px`,
    ).toBe(true);
  }
});
