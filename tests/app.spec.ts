import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

async function quickQuiz(page: Page, item = "VALORANT") {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Find My OS", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: /^PC Windows/ }).click();
  await page.getByRole("button", { name: "Windows", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /^Gaming Casual/ }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  if (item) await page.getByLabel("Essential apps").fill(item);
  await page.getByRole("button", { name: "See my results" }).click();
}

test("desktop quick quiz, compatibility details, persistence, and reset", async ({
  page,
}) => {
  await quickQuiz(page);
  await expect(page.locator(".recommendation-name")).toContainText(
    "Windows 11",
  );
  await expect(page.getByRole("tabpanel")).toContainText("Native support");
  await page.getByRole("tab", { name: "Why this result?" }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "not a compatibility percentage",
  );
  await page.getByLabel("Back up your files and recovery keys").check();
  await page.reload();
  await page.getByRole("button", { name: "My result", exact: true }).click();
  await expect(page.locator(".recommendation-name")).toContainText(
    "Windows 11",
  );
  await expect(
    page.getByLabel("Back up your files and recovery keys"),
  ).toBeChecked();
  await page
    .getByRole("button", { name: "Clear answers & start over" })
    .click();
  await page.getByRole("button", { name: "Keep my answers" }).click();
  await expect(page.locator(".recommendation-name")).toContainText(
    "Windows 11",
  );
  await page
    .getByRole("button", { name: "Clear answers & start over" })
    .click();
  await page.getByRole("button", { name: "Clear & start over" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "What device",
  );
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeDisabled();
});

test("back preserves answers and optional refinement completes", async ({
  page,
}) => {
  await quickQuiz(page, "UnknownPrinter 500");
  await page.getByRole("button", { name: "Edit my answers" }).click();
  await expect(
    page.getByRole("button", { name: /^PC Windows/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /^Gaming Casual/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Essential apps")).toHaveValue(
    "UnknownPrinter 500",
  );
  await page.getByRole("button", { name: "See my results" }).click();
  await page.getByRole("button", { name: "Refine my results" }).click();
  await page.getByLabel("Manufacturer and exact model").fill("ThinkPad T480");
  for (let i = 0; i < 8; i++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Update my results" }).click();
  await expect(page.locator(".your-setup")).toContainText("ThinkPad T480");
  await expect(page.getByRole("tabpanel")).toContainText("Needs checking");
  await page.getByRole("tab", { name: "Hardware & requirements" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("ThinkPad T480");
});

test("no-match result still allows inspecting an excluded option", async ({
  page,
}) => {
  await quickQuiz(page, "Final Cut Pro");
  await expect(
    page.getByRole("heading", { name: "No safe match yet." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Inspect requirements" })
    .first()
    .click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Not a primary recommendation",
  );
});

test("mobile home and quiz do not overflow, FAQ and Linux exploration work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Find the right OS for your PC or Mac.",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Explore OS Options" }).click();
  await page
    .getByRole("button", { name: "Explore Linux distributions" })
    .click();
  await expect(page.locator(".distro-grid")).toContainText(
    "Fedora Workstation",
  );
  await page
    .locator("summary")
    .filter({ hasText: "What does “dual boot” mean?" })
    .click();
  await expect(page.locator(".faq-list details[open]")).toContainText(
    "keeping two operating systems",
  );
  await quickQuiz(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Refine my results" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("corrupt saved data and blocked storage do not break the app", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("better-tech-v1", "{broken"),
  );
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await page.reload();
  await expect(page.getByRole("status")).toContainText("blocked saving");
  await page
    .getByRole("button", { name: "Find My OS", exact: true })
    .first()
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "What device",
  );
});

test("keyboard focus and privacy dialog are usable", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Privacy & your data" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Privacy & your data" }),
  ).toBeFocused();
});
