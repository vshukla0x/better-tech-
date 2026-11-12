import type { Family, OSOption, Source, Support } from "../lib/types";

// A curated snapshot, not a live compatibility database. Set a date only after inspection.
const checked = "2026-11-12";
export const sources = {
  windows: {
    title: "Windows 11 specifications and system requirements",
    author: "Microsoft",
    url: "https://www.microsoft.com/en-us/windows/windows-11-specifications",
    checked,
  },
  macos: {
    title: "How to download and install macOS",
    author: "Apple",
    url: "https://support.apple.com/en-us/122727",
    checked,
  },
  mint: {
    title: "Linux Mint FAQ",
    author: "Linux Mint",
    url: "https://linuxmint.com/faq.php",
    checked,
  },
  ubuntu: {
    title: "Download Ubuntu Desktop",
    author: "Canonical",
    url: "https://ubuntu.com/download/desktop",
    checked,
  },
  fedora: {
    title: "Download Fedora Workstation",
    author: "Fedora Project",
    url: "https://fedoraproject.org/workstation/download",
    checked,
  },
  xubuntu: {
    title: "Download and system requirements",
    author: "Xubuntu Team",
    url: "https://xubuntu.org/download/",
    checked,
  },
  valorant: {
    title: "VALORANT Specs",
    author: "Riot Games",
    url: "https://playvalorant.com/en-us/specs/",
    checked,
  },
  dota: {
    title: "Dota 2 — System Requirements",
    author: "Valve",
    url: "https://store.steampowered.com/app/570/Dota_2/",
    checked,
  },
  finalcut: {
    title: "Final Cut Pro — Questions and answers",
    author: "Apple",
    url: "https://www.apple.com/final-cut-pro/",
    checked,
  },
  vscode: {
    title: "Requirements for Visual Studio Code",
    author: "Microsoft",
    url: "https://code.visualstudio.com/docs/supporting/requirements",
    checked,
  },
  photoshop: {
    title: "Photoshop system requirements",
    author: "Adobe",
    url: "https://helpx.adobe.com/photoshop/system-requirements.html",
    checked: null,
  },
  proton: {
    title: "Proton — Compatibility tool for Steam Play",
    author: "Valve",
    url: "https://github.com/ValveSoftware/Proton",
    checked,
  },
  google: {
    title: "Learn about system requirements & browsers",
    author: "Google",
    url: "https://support.google.com/docs/answer/2375082?hl=en",
    checked,
  },
} satisfies Record<string, Source>;

export const operatingSystems: OSOption[] = [
  {
    id: "windows",
    family: "windows",
    name: "Windows 11",
    subtitle: "Familiar. Widely supported.",
    description:
      "A familiar desktop with a broad selection of PC software, games, and manufacturer tools.",
    strengths: [
      "Broad PC game selection",
      "Commercial desktop software",
      "Manufacturer utilities",
    ],
    tradeoff:
      "Licensing, account requirements, and hardware eligibility need consideration.",
    ram: 4,
    storage: 64,
    requirements:
      "4 GB RAM · 64 GB storage · supported 64-bit CPU · TPM 2.0 · Secure Boot capable UEFI · DirectX 12 graphics",
    source: sources.windows,
    download: "https://www.microsoft.com/software-download/windows11",
  },
  {
    id: "macos",
    family: "macos",
    name: "macOS",
    subtitle: "Built around your Mac.",
    description:
      "Apple’s integrated desktop for compatible Macs, with creative apps and a Unix-based development environment.",
    strengths: [
      "Apple device integration",
      "Mac creative applications",
      "Integrated hardware and software",
    ],
    tradeoff:
      "Only for eligible Apple hardware; many PC games and some specialist tools are unavailable.",
    requirements:
      "A compatible Apple Mac · supported macOS release · model-specific storage and memory requirements",
    source: sources.macos,
    download: sources.macos.url,
  },
  {
    id: "mint",
    family: "linux",
    name: "Linux Mint",
    subtitle: "A familiar way into Linux.",
    description:
      "A Linux distribution with a traditional desktop layout and graphical tools for everyday tasks.",
    strengths: [
      "Traditional desktop layout",
      "Graphical system tools",
      "Long-term support releases",
    ],
    tradeoff:
      "Windows-only apps may need a web version or replacement; hardware still needs testing.",
    ram: 2,
    storage: 20,
    requirements:
      "64-bit Intel/AMD build · 2 GB RAM (4 GB recommended) · 20 GB storage (100 GB recommended)",
    source: sources.mint,
    download: "https://linuxmint.com/download.php",
  },
  {
    id: "ubuntu",
    family: "linux",
    name: "Ubuntu LTS",
    subtitle: "A well-documented starting point.",
    description:
      "A Linux distribution with long-term support and a large ecosystem of tutorials and development tools.",
    strengths: [
      "Long-term support",
      "Extensive documentation",
      "Development tool ecosystem",
    ],
    tradeoff:
      "Its desktop may feel different, and proprietary drivers or software may need extra setup.",
    ram: 6,
    storage: 25,
    requirements:
      "26.04.1 LTS: 2 GHz dual-core CPU · 6 GB RAM · 25 GB free storage · correct device-specific installation image",
    source: sources.ubuntu,
    download: sources.ubuntu.url,
  },
  {
    id: "fedora",
    family: "linux",
    name: "Fedora Workstation",
    subtitle: "A modern Linux workspace.",
    description:
      "A Linux distribution with a current GNOME desktop and an emphasis on open-source development.",
    strengths: [
      "Modern development tools",
      "Current desktop technology",
      "Open-source focus",
    ],
    tradeoff:
      "More frequent release upgrades; some codecs and proprietary drivers require extra steps.",
    requirements:
      "Most variants recommend 4 GB RAM and 40 GB storage; confirm the release, architecture, and exact device.",
    source: sources.fedora,
    download: sources.fedora.url,
  },
  {
    id: "xubuntu",
    family: "linux",
    name: "Xubuntu",
    subtitle: "A lighter desktop to evaluate.",
    description:
      "An Ubuntu-based Linux distribution using the lighter Xfce desktop, worth evaluating on older PCs.",
    strengths: [
      "Lighter desktop environment",
      "Traditional desktop controls",
      "Ubuntu software ecosystem",
    ],
    tradeoff:
      "A lighter desktop cannot fix failing hardware or guarantee faster apps; modern browsers still need memory.",
    ram: 1,
    storage: 8.6,
    requirements:
      "Intel/AMD 64-bit CPU · 1 GB RAM minimum (2 GB recommended) · 8.6 GB free storage (20 GB recommended)",
    source: sources.xubuntu,
    download: sources.xubuntu.url,
  },
];

interface ItemEntry {
  aliases: string[];
  support: Record<Family, Support>;
  detail: Record<Family, string>;
  source: Source;
  webAlternative?: string;
}
export const compatibilityItems: ItemEntry[] = [
  {
    aliases: ["google drive", "drive for desktop", "google drive for desktop"],
    support: { windows: "native", macos: "native", linux: "incompatible" },
    detail: {
      windows:
        "Drive for desktop is listed for supported Windows versions. Verify 64-bit versus ARM64 requirements, WebView2, school/work policies, and supported file systems.",
      macos:
        "Drive for desktop is listed for macOS Ventura 13 or later. Check your exact release and the current Google requirements before installing.",
      linux:
        "Google says Drive for desktop is not available on Linux. The web interface is not an equivalent desktop sync client.",
    },
    webAlternative:
      "Google Drive on the web is an official alternative on Linux. It is not the desktop sync client: verify offline access, file syncing, account restrictions, and your exact workflow before accepting it.",
    source: sources.google,
  },
  {
    aliases: ["google docs", "google sheets", "google slides"],
    support: { windows: "web", macos: "web", linux: "web" },
    detail: {
      windows:
        "Browser-based workflow, not a native desktop app. Use a compatible, up-to-date browser with JavaScript and cookies; check offline features, file fidelity, and school/work policies.",
      macos:
        "Browser-based workflow, not a native desktop app. Use a compatible, up-to-date browser with JavaScript and cookies; check offline features, file fidelity, and school/work policies.",
      linux:
        "Browser-based workflow, not a native desktop app. Use a compatible, up-to-date browser with JavaScript and cookies; check offline features, file fidelity, and school/work policies.",
    },
    source: sources.google,
  },
  {
    aliases: ["valorant", "riot valorant"],
    support: {
      windows: "native",
      macos: "incompatible",
      linux: "incompatible",
    },
    detail: {
      windows:
        "Native Windows version. Riot lists Windows 10/11 64-bit; Windows 11 also requires TPM 2.0 and Secure Boot. Verify Vanguard anti-cheat, CPU, and GPU requirements.",
      macos:
        "No supported native macOS version is listed for this required PC title. Do not assume a compatibility layer can satisfy Vanguard anti-cheat.",
      linux:
        "No supported Linux version is listed. Vanguard anti-cheat is a blocker for this required title; Proton is not a supported workaround.",
    },
    source: sources.valorant,
  },
  {
    aliases: ["dota 2", "dota2"],
    support: { windows: "native", macos: "native", linux: "native" },
    detail: {
      windows:
        "Native version listed by Valve. Check current Steam, GPU, 4 GB RAM, and 60 GB free storage requirements; VAC anti-cheat is listed.",
      macos:
        "Native version listed by Valve. Check the exact Mac, Metal-capable GPU, Steam support, and 60 GB free storage; VAC is listed.",
      linux:
        "Native Linux version listed by Valve. Check CPU architecture, graphics drivers, 4 GB RAM, and 60 GB free storage; VAC is listed.",
    },
    source: sources.dota,
  },
  {
    aliases: ["final cut pro", "final cut", "finalcut"],
    support: {
      windows: "incompatible",
      macos: "native",
      linux: "incompatible",
    },
    detail: {
      windows:
        "The required desktop application is available for Mac, not Windows. A different video editor is a substitute, not Final Cut Pro.",
      macos:
        "Native Mac app: macOS 15.6+, 8 GB RAM (16 GB recommended), 7.2 GB disk space; some features require Apple silicon. Check plugins and exact Mac.",
      linux:
        "The required desktop application is available for Mac, not Linux. A different video editor is a substitute, not Final Cut Pro.",
    },
    source: sources.finalcut,
  },
  {
    aliases: ["vs code", "vscode", "visual studio code"],
    support: { windows: "native", macos: "native", linux: "native" },
    detail: {
      windows:
        "Native support for supported 64-bit Windows clients. Verify any extensions, SDKs, and platform-specific tools separately.",
      macos:
        "Native support for macOS versions receiving Apple security updates. Check architecture and extension requirements.",
      linux:
        "Native packages for Debian/Ubuntu and Red Hat/Fedora platforms; requires GLIBC 2.28+ and GLIBCXX 3.4.25+. Mint/Xubuntu package details and extensions still need checking.",
    },
    source: sources.vscode,
  },
  {
    aliases: ["photoshop", "adobe photoshop"],
    support: { windows: "unknown", macos: "unknown", linux: "unknown" },
    detail: {
      windows:
        "Needs checking: the official requirements page could not be verified. Check your exact Photoshop version, GPU, plugins, and OS release.",
      macos:
        "Needs checking: verify your Photoshop version, Apple chip, GPU features, plugins, and supported macOS release with Adobe.",
      linux:
        "Needs checking: do not assume the desktop app works. If you accept a web version or substitute, test your required features, file formats, and plugins first.",
    },
    source: sources.photoshop,
  },
];

export const statusLabels: Record<Support, string> = {
  native: "Native support",
  web: "Web version",
  layer: "Compatibility layer",
  substitute: "Substitute",
  incompatible: "Not supported",
  unknown: "Needs checking",
};
