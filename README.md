# Better Tech

A responsive OS recommender for people who want a better fit for their computer, not a sales pitch to switch. Built with React, TypeScript, and Vite. All recommendations run in the browser; no account, backend, AI API, or hardware scanning is required.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

```sh
npm run build   # Type-check and create dist/
npm run preview # Preview the production build
npm run lint
```

Deploy `dist/` to any static host. The default build assumes the domain root; adjust Vite's `base` for a subdirectory deployment.

## Features

- Three-question quiz with conditional device questions, multi-select activities, and optional exact app/game/peripheral names.
- Provisional results, all six OS candidates, exclusions, compatibility statuses, and itemized preference scores.
- Nine optional refinement screens for hardware, required items, acceptable alternatives, priorities, and troubleshooting experience.
- Back navigation preserves answers; browser-local persistence, checklist, safe reset confirmation, and a graceful storage-blocked warning.
- Equal-weight Windows/macOS/Linux comparison, Linux-distribution exploration, plain-language glossary, and safe next-step guidance.
- Keyboard-operable tiles and tabs, focus management, reduced-motion support, responsive layouts, local Inter font, and print/PDF support.

## Recommendation rules and evidence

- `src/data/compatibility.ts`: OS requirements and curated compatibility entries, with official URLs, publisher names, and inspection dates.
- `src/lib/recommend.ts`: pure, deterministic compatibility gates and ranking rules, separate from React.
- `src/data/quiz.ts`: activity options and refinement sequence.
- `src/lib/types.ts`: typed answer, evidence, and evaluation models.

Eligibility and confirmed blockers are evaluated **before** preference points. macOS is never a primary suggestion for a PC or unidentified device. Other devices and non-macOS installation paths on unverified Macs require more research instead of assuming a standard PC installer works. Published RAM/storage minima and known game/app minima can exclude an option. Scores only order the remaining candidates; they are not percentages, benchmarks, or compatibility certifications.

Recognized examples include VALORANT (including anti-cheat checks), Dota 2, Final Cut Pro, VS Code, Google Drive, and Google Docs/Sheets/Slides. Exact normalized aliases are matched; arbitrary substring matches are deliberately avoided. Unrecognized items and inaccessible source pages stay **Needs checking**. Accepting web versions does not magically remove a desktop incompatibility; only a recorded official web alternative changes that result. Accepted substitutes remain explicitly unverified.

This is a **small, manually checked snapshot as of November 12, 2026**, not a live compatibility service. Exact device/driver support is not certified, so all current recommendations remain provisional, even after refinement. CPU/GPU names produce checks, not invented driver conclusions. Revisit official release requirements, support lifecycles, exact app versions, architectures, anti-cheat policies, and downloads before switching. Fedora's source describes recommended resources rather than a hard minimum; the engine does not treat those recommendations as confirmed exclusion thresholds.

Ranking weights are visible in `recommend.ts` and in the results. Existing-OS familiarity has a substantial weight to avoid suggesting a switch without a reason. Linux's privacy/customization and desktop-fit weights are product heuristics, not measured superiority claims. Battery priority is recorded and explained but earns no points without device-specific evidence. No speed, battery-life, or FPS gain is promised.

## Privacy

Answers, completion state, and checklist use the versioned `better-tech-v1` local-storage key. Nothing is sent to a server. All assets, including the Inter font, are local. Official links open third-party sites. Reset only clears this app's saved state; it never changes the computer's OS. Avoid entering serial numbers or sensitive information. In private/blocked storage modes, answers may not survive a refresh.

## Environment and security

No environment variables or API keys are required. A local `.env` is provided and ignored by Git; `.env.example` is the safe template to commit. Never put private values in `VITE_*` variables: they are public in browser code. Review [SECURITY.md](SECURITY.md) for deployment headers, local-storage limitations, and the staged-file secret check. The development server binds to localhost by default.

## Tests

```sh
npx playwright install chromium
npm test
```

Or use an existing Chromium installation:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

The suite covers compatibility gates, unknown evidence, Mac eligibility, anti-cheat blockers, hardware minima, accepted web/substitute paths, persistence, refinement, no-match results, corruption/storage failure, mobile layouts, keyboard controls, and automated accessibility scans. Playwright starts Vite automatically, or reuses a local server. Automated scans complement, but do not replace, manual accessibility testing.

Inter is distributed under the SIL Open Font License; see `public/fonts/OFL.txt`.
