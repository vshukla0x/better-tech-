import { compatibilityItems, operatingSystems } from "../data/compatibility";
import type { Answers, Evaluation, ItemCheck, OSOption } from "./types";

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/[™®]/g, "").replace(/\s+/g, " ");
export function checkItems(a: Answers, os: OSOption): ItemCheck[] {
  return a.mustHaves
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((item) => {
      const entry = compatibilityItems.find((e) =>
        e.aliases.includes(normalize(item)),
      );
      if (!entry)
        return {
          item,
          status: "unknown",
          detail: `No verified entry for “${item}”. Check its publisher’s supported OS versions, exact model/version, and required features. ${a.uses.includes("gaming") ? "For a game, check its specific title, launcher, multiplayer mode, and anti-cheat; Steam availability alone does not establish support." : "For a peripheral, check the manufacturer’s drivers and utilities for your exact model."}`,
        };
      const status = entry.support[os.family];
      if (
        status === "incompatible" &&
        entry.webAlternative &&
        a.alternatives !== "native"
      ) {
        return {
          item,
          status: "web",
          detail: entry.webAlternative,
          source: entry.source,
        };
      }
      if (status === "incompatible" && a.alternatives === "alternatives")
        return {
          item,
          status: "substitute",
          detail: `${entry.detail[os.family]} You accept alternatives, but no replacement has been verified for your workflow. Test projects, plugins, features, and file exchange before switching.`,
          source: entry.source,
        };
      return {
        item,
        status,
        detail: entry.detail[os.family],
        source: entry.source,
      };
    });
}

export function recommend(a: Answers): Evaluation[] {
  return operatingSystems
    .map((os) => {
      const excluded: string[] = [];
      const hardware: string[] = [];
      const reasons: Evaluation["reasons"] = [];
      const add = (text: string, points: number) => {
        if (points) reasons.push({ text, points });
      };
      const ram = Number(a.ram) || 0;
      const storage = Number(a.storage) || 0;
      const linux = os.family === "linux";
      const arm =
        a.architecture === "arm" ||
        /snapdragon|apple\s*m[1-9]|\bm[1-9]\b/i.test(a.cpu);
      if (os.family === "macos" && a.device !== "mac")
        excluded.push(
          "Requires eligible Apple Mac hardware; this device has not been identified as a Mac.",
        );
      if (a.device === "other")
        excluded.push(
          "This desktop OS has not been verified for your other device. Identify its exact model and installation restrictions first.",
        );
      if (a.device === "mac" && os.family !== "macos")
        excluded.push(
          "No verified installation path for this exact Mac. Standard PC installers must not be assumed to support Apple silicon, T2, or other Mac-specific hardware.",
        );
      if (arm && ["mint", "xubuntu"].includes(os.id))
        excluded.push(
          "The evaluated installer is for Intel/AMD 64-bit, not this ARM processor.",
        );
      if (ram && os.ram && ram < os.ram)
        excluded.push(
          `${ram} GB RAM is below the published ${os.ram} GB minimum for this evaluated release.`,
        );
      if (storage && os.storage && storage < os.storage)
        excluded.push(
          `${storage} GB free storage is below the published ${os.storage} GB requirement.`,
        );
      const checks = checkItems(a, os);
      checks
        .filter((c) => c.status === "incompatible")
        .forEach((c) =>
          excluded.push(`${c.item} does not meet your must-have requirement.`),
        );
      if (
        checks.some((c) => normalize(c.item).includes("final cut")) &&
        os.family === "macos" &&
        a.alternatives !== "alternatives" &&
        ram &&
        ram < 8
      )
        excluded.push("Final Cut Pro requires at least 8 GB RAM.");
      if (
        checks.some((c) => ["dota 2", "dota2"].includes(normalize(c.item))) &&
        a.alternatives !== "alternatives"
      ) {
        if (ram && ram < 4) excluded.push("Dota 2 requires at least 4 GB RAM.");
        if (storage && storage < 60)
          excluded.push(
            "Dota 2 alone requires 60 GB free storage, before OS and other apps.",
          );
      }
      hardware.push(
        `${a.model || "Your exact device model"}: graphics${a.gpu ? ` (${a.gpu})` : " drivers"}, Wi-Fi, sleep/wake, fingerprint reader, webcam, audio, and peripherals are unverified. Test each feature you rely on.`,
      );
      if (os.id === "windows")
        hardware.push(
          "Run Microsoft PC Health Check and confirm supported CPU, TPM 2.0, Secure Boot capability, DirectX 12 drivers, and manufacturer support. RAM alone does not prove eligibility.",
        );
      if (os.id === "macos")
        hardware.push(
          "Use Apple Software Update and its model compatibility list to select a supported macOS version. Being a Mac does not guarantee the newest release is supported.",
        );
      if (linux)
        hardware.push(
          "Confirm CPU architecture and the exact GPU/Wi-Fi driver for this release. A live USB trial helps check hardware, but is not a battery-life or installed-performance benchmark.",
        );
      if (arm && !["mint", "xubuntu"].includes(os.id))
        hardware.push(
          "ARM device detected: an ARM download does not guarantee this specific laptop, firmware, or app architecture is supported.",
        );
      if (a.uses.includes("gaming"))
        hardware.push(
          "Check every specific game and anti-cheat requirement. A compatibility layer translates Windows software; it is not native support and does not guarantee multiplayer access or FPS.",
        );
      add("Baseline for an eligible option", 10);
      if (a.currentOS === os.family)
        add(
          "Keeps the OS family you already use",
          12 + a.priorities.familiarity * 6,
        );
      if (a.uses.includes("gaming") && os.family === "windows")
        add("PC gaming is a priority; verify each title separately", 9);
      if (a.uses.includes("programming") && linux)
        add(
          "Linux development environment matches your programming interest",
          os.id === "fedora" && a.comfort === "confident" ? 12 : 7,
        );
      if (a.uses.includes("programming") && os.family === "macos")
        add("Unix-based tools fit your programming interest", 5);
      if (
        a.uses.includes("creation") &&
        ["macos", "windows"].includes(os.family)
      )
        add("Creative workflow: check your commercial tools and plugins", 5);
      if (
        a.uses.some((u) => ["study", "browsing"].includes(u)) &&
        os.id === "mint"
      )
        add("Traditional desktop for study and everyday tasks", 5);
      if (
        (a.uses.includes("older") || (ram && ram <= 4)) &&
        os.id === "xubuntu"
      )
        add("A lighter desktop is worth evaluating for limited hardware", 15);
      if (a.uses.includes("older") && os.id === "mint")
        add("An alternative to evaluate on older supported PCs", 4);
      if (linux) {
        add(
          "You value control over privacy settings; configuration still matters",
          a.priorities.privacy * 3,
        );
        add("You value a customizable desktop", a.priorities.customization * 3);
        if (["mint", "ubuntu", "xubuntu"].includes(os.id))
          add(
            "Long-term-support choices align with lower-maintenance preferences",
            a.priorities.maintenance * 2,
          );
        if (a.comfort === "new" && os.id === "mint")
          add(
            "Graphical tools and traditional layout for a first Linux trial",
            5,
          );
        if (a.comfort === "new" && os.id === "fedora")
          add(
            "Frequent release upgrades may not fit a low-troubleshooting preference",
            -5,
          );
      }
      if (a.device === "mac" && os.id === "macos")
        add("Integrated Apple hardware and software on your existing Mac", 12);
      const score = reasons.reduce((sum, r) => sum + r.points, 0);
      return {
        os,
        score,
        reasons,
        excluded,
        checks,
        hardware,
        provisional: true,
      };
    })
    .sort(
      (a, b) =>
        Number(a.excluded.length > 0) - Number(b.excluded.length > 0) ||
        b.score - a.score,
    );
}
