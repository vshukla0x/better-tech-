import { test, expect } from "@playwright/test";
import { recommend } from "../src/lib/recommend";
import { emptyAnswers } from "../src/lib/types";
import type { Answers } from "../src/lib/types";

const answers = (patch: Partial<Answers> = {}): Answers => ({
  ...emptyAnswers,
  device: "pc",
  currentOS: "windows",
  uses: ["browsing"],
  ...patch,
});

test("never recommends macOS on PC or unidentified hardware", () => {
  for (const device of ["pc", "other", "unknown", ""])
    expect(
      recommend(answers({ device })).find((r) => r.os.id === "macos")!.excluded
        .length,
    ).toBeGreaterThan(0);
});
test("VALORANT blockers override every Linux preference", () => {
  const result = recommend(
    answers({
      mustHaves: "VALORANT",
      uses: ["gaming", "programming"],
      priorities: {
        familiarity: 0,
        privacy: 2,
        customization: 2,
        battery: 2,
        maintenance: 2,
      },
    }),
  );
  expect(result[0].os.id).toBe("windows");
  expect(
    result
      .filter((r) => r.os.family === "linux")
      .every((r) => r.excluded.length > 0),
  ).toBe(true);
  expect(result[0].checks[0].detail).toContain("Vanguard");
});
test("unknown peripherals are not invented as supported", () => {
  const result = recommend(
    answers({
      model: "Mystery Laptop 2026",
      mustHaves: "Unlisted device 2000",
    }),
  )[0];
  expect(result.checks[0].status).toBe("unknown");
  expect(result.provisional).toBe(true);
  expect(result.hardware[0]).toContain("Mystery Laptop 2026");
});
test("Mac-only required software produces no PC recommendation", () => {
  expect(
    recommend(answers({ mustHaves: "Final Cut Pro" })).every(
      (r) => r.excluded.length > 0,
    ),
  ).toBe(true);
  const mac = recommend(
    answers({
      device: "mac",
      currentOS: "macos",
      mustHaves: "Final Cut Pro",
      ram: "16",
    }),
  );
  expect(mac[0].os.id).toBe("macos");
  expect(mac[0].excluded).toEqual([]);
});
test("web flexibility does not magically fix a missing desktop app", () => {
  expect(
    recommend(
      answers({ mustHaves: "Final Cut Pro", alternatives: "web" }),
    ).every((r) => r.excluded.length > 0),
  ).toBe(true);
});

test("an official web alternative requires consent and retains its limitations", () => {
  const exact = recommend(
    answers({ mustHaves: "Google Drive", alternatives: "native" }),
  ).find((r) => r.os.id === "mint")!;
  expect(exact.excluded.length).toBeGreaterThan(0);
  const flexible = recommend(
    answers({ mustHaves: "Google Drive", alternatives: "web" }),
  ).find((r) => r.os.id === "mint")!;
  expect(flexible.checks[0].status).toBe("web");
  expect(flexible.checks[0].detail).toContain("not the desktop sync client");
  expect(flexible.excluded).toEqual([]);
});
test("accepted alternatives remain unverified substitutes, not native support", () => {
  const result = recommend(
    answers({ mustHaves: "Final Cut Pro", alternatives: "alternatives" }),
  )[0];
  expect(result.checks[0].status).toBe("substitute");
  expect(result.checks[0].detail).toContain("no replacement has been verified");
});
test("low RAM excludes minimum violations and considers Xubuntu without speed claims", () => {
  const result = recommend(
    answers({ ram: "2", storage: "32", uses: ["older"] }),
  );
  expect(result[0].os.id).toBe("xubuntu");
  expect(
    result.find((r) => r.os.id === "windows")!.excluded.join(" "),
  ).toContain("below");
  expect(
    result.find((r) => r.os.id === "ubuntu")!.excluded.length,
  ).toBeGreaterThan(0);
});
test("minimum game hardware is checked separately from the OS", () => {
  const result = recommend(
    answers({ mustHaves: "Dota 2", ram: "2", storage: "50" }),
  );
  expect(result.every((r) => r.excluded.length > 0)).toBe(true);
});
test("native support retains official source and last-checked date", () => {
  const result = recommend(answers({ mustHaves: "Dota 2; VS Code" }))[0];
  expect(
    result.checks.every(
      (c) => c.status === "native" && c.source?.checked === "2026-11-12",
    ),
  ).toBe(true);
});
test("no battery-life ranking claims without device evidence", () => {
  expect(
    recommend(
      answers({ priorities: { ...emptyAnswers.priorities, battery: 0 } }),
    ).map((r) => r.score),
  ).toEqual(
    recommend(
      answers({ priorities: { ...emptyAnswers.priorities, battery: 2 } }),
    ).map((r) => r.score),
  );
});
test("ARM devices cannot use evaluated x86-only images", () => {
  const result = recommend(
    answers({ cpu: "Qualcomm Snapdragon X Elite", architecture: "arm" }),
  );
  expect(
    result
      .filter((r) => ["mint", "xubuntu"].includes(r.os.id))
      .every((r) => r.excluded.some((e) => e.includes("ARM"))),
  ).toBe(true);
});
test("other-device ambiguity never silently becomes a PC installation recommendation", () => {
  expect(
    recommend(answers({ device: "other" })).every((r) => r.excluded.length > 0),
  ).toBe(true);
});
