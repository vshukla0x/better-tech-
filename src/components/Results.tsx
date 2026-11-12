import { useState } from "react";
import { Icon, OSLogo } from "./Icon";
import type { Answers, Evaluation, ItemCheck } from "../lib/types";
import { recommend } from "../lib/recommend";
import { statusLabels, sources } from "../data/compatibility";
import { SourceLink } from "./SourceLink";
import { useOptions } from "../data/quiz";

function CompatibilityCheck({ check }: { check: ItemCheck }) {
  return (
    <div className="compatibility-item">
      <div className="compatibility-item-heading">
        <h3>{check.item}</h3>
        <span
          className={`badge ${check.status === "native" ? "badge-blue" : ""}`}
        >
          {statusLabels[check.status]}
          {check.status === "substitute" ? " · Needs checking" : ""}
        </span>
      </div>
      <p>{check.detail}</p>
      {check.source && <SourceLink source={check.source} />}
    </div>
  );
}
function ReasonList({ result }: { result: Evaluation }) {
  return (
    <div className="scoring">
      <p>
        Rule-based fit points — not a compatibility percentage or performance
        score.
      </p>
      {result.reasons.map((r) => (
        <div key={r.text}>
          <span>{r.text}</span>
          <strong>
            {r.points > 0 ? "+" : ""}
            {r.points}
          </strong>
        </div>
      ))}
      <div className="scoring-total">
        <strong>Total preference points</strong>
        <strong>{result.score}</strong>
      </div>
    </div>
  );
}
export function Results({
  answers,
  onRefine,
  onEdit,
  onReset,
  checklist,
  onCheck,
}: {
  answers: Answers;
  onRefine: () => void;
  onEdit: () => void;
  onReset: () => void;
  checklist: string[];
  onCheck: (id: string) => void;
}) {
  const results = recommend(answers);
  const primary = results.find((r) => !r.excluded.length);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("compatibility");
  const [selectedOS, setSelectedOS] = useState<string | null>(null);
  const viewed =
    results.find((r) => r.os.id === selectedOS) || primary || results[0];
  const todo = [
    [
      "backup",
      "Back up your files and recovery keys",
      "Keep a copy on another drive or a trusted backup service. Check you can restore it.",
    ],
    [
      "apps",
      "Verify your exact apps, games, and peripherals",
      "Check versions, plugins, file formats, multiplayer anti-cheat, and manufacturer drivers.",
    ],
    [
      "hardware",
      "Test the hardware you use every day",
      "Check graphics, Wi-Fi, sound, webcam, sleep/wake, battery behavior, and fingerprint sign-in.",
    ],
    [
      "recovery",
      "Have a way back before installing",
      "Create recovery media, keep your license details, and use a guide for your exact device.",
    ],
  ];
  return (
    <main className="results-page section-width" id="main">
      <div className="results-toolbar">
        <button className="text-button muted" onClick={onEdit}>
          <Icon name="back" size={16} /> Edit my answers
        </button>
        <button className="text-button muted" onClick={() => window.print()}>
          Print / save PDF <Icon name="external" size={14} />
        </button>
      </div>
      <div className="results-heading">
        <span className="eyebrow">YOUR SETUP. YOUR SHORTLIST.</span>
        <h1 className="screen-title" tabIndex={-1}>
          {primary
            ? "A clearer direction for your computer."
            : "Let’s resolve a few things first."}
        </h1>
        <p>
          {primary
            ? "Here’s a starting point, the reasons behind it, and what still needs checking."
            : "No evaluated OS currently clears all your device and must-have requirements. Keeping your current setup may be the right choice for now."}
        </p>
      </div>
      <div className="result-layout">
        <section className="recommendation-card panel">
          <div className="recommendation-top">
            <span className="eyebrow">
              {primary
                ? "YOUR PROVISIONAL RECOMMENDATION"
                : "NO PRIMARY RECOMMENDATION"}
            </span>
            <span className="badge">
              <Icon name="info" size={12} /> Provisional
            </span>
          </div>
          {primary ? (
            <>
              <div className="recommendation-name">
                <div className="os-icon">
                  <OSLogo family={primary.os.family} size={40} />
                </div>
                <div>
                  <h2>{primary.os.name}</h2>
                  <p>{primary.os.subtitle}</p>
                </div>
              </div>
              <p className="recommendation-description">
                {primary.os.description}
              </p>
              <h3>Why it’s on your shortlist</h3>
              <ul className="reason-list">
                {primary.reasons
                  .filter((r) => r.points > 0 && !r.text.includes("Baseline"))
                  .slice()
                  .sort((a, b) => b.points - a.points)
                  .slice(0, 3)
                  .map((r) => (
                    <li key={r.text}>
                      <Icon name="check" size={17} />
                      {r.text}
                    </li>
                  ))}
              </ul>
              <div className="tradeoff">
                <strong>The trade-off</strong>
                <p>{primary.os.tradeoff}</p>
              </div>
            </>
          ) : (
            <div className="no-result">
              <Icon name="shield" size={44} />
              <h2>No safe match yet.</h2>
              <p>
                Check the exclusions below. Don’t replace your OS just to follow
                a ranking that cannot meet your needs.
              </p>
            </div>
          )}
          <div className="provisional-note">
            <Icon name="info" size={18} />
            <p>
              <strong>Why provisional?</strong> Your exact device and full
              workflow are not verified. Missing hardware details or an
              essential compatibility check could change this recommendation.
              Refined does not mean certified.
            </p>
          </div>
          <button className="button primary full-width" onClick={onRefine}>
            <Icon name="tune" size={18} /> Refine my results{" "}
            <Icon name="arrow" size={18} />
          </button>
        </section>
        <aside className="your-setup panel">
          <span className="eyebrow">BASED ON WHAT YOU TOLD US</span>
          <h3>Your setup, at a glance</h3>
          <dl>
            <div>
              <dt>Device</dt>
              <dd>
                {answers.model ||
                  {
                    pc: "PC",
                    mac: "Apple Mac",
                    other: "Other device",
                    unknown: "Not known yet",
                  }[answers.device] ||
                  "Not known yet"}
              </dd>
            </div>
            <div>
              <dt>Current OS</dt>
              <dd>
                {{
                  windows: "Windows",
                  macos: "macOS",
                  linux: "Linux",
                  other: "Other",
                  unknown: "Not known yet",
                }[answers.currentOS] || "Not known yet"}
              </dd>
            </div>
            <div>
              <dt>Everyday use</dt>
              <dd>
                {useOptions
                  .filter((o) => answers.uses.includes(o.id))
                  .map((o) => o.name)
                  .join(", ") || "Not specified"}
              </dd>
            </div>
            <div>
              <dt>Memory / free storage</dt>
              <dd>
                {answers.ram ? `${answers.ram} GB RAM` : "RAM unknown"} ·{" "}
                {answers.storage
                  ? `${answers.storage} GB free`
                  : "Space unknown"}
              </dd>
            </div>
            <div>
              <dt>Must-haves</dt>
              <dd>
                {answers.mustHaves ||
                  "None specified — not a compatibility guarantee"}
              </dd>
            </div>
            <div>
              <dt>Flexibility</dt>
              <dd>
                {
                  {
                    native: "Exact desktop apps required",
                    web: "Web versions accepted if verified",
                    alternatives: "Alternatives accepted if tested",
                  }[answers.alternatives]
                }
              </dd>
            </div>
          </dl>
          <button className="text-button" onClick={onEdit}>
            Update my answers <Icon name="arrow" size={16} />
          </button>
        </aside>
      </div>

      {viewed && (
        <section className="result-detail panel">
          <div className="detail-heading">
            <div>
              <span className="eyebrow">LOOK BEFORE YOU LEAP</span>
              <h2>Inside your {viewed.os.name} result</h2>
            </div>
            {selectedOS && (
              <button
                className="text-button"
                onClick={() => setSelectedOS(null)}
              >
                Back to top match
              </button>
            )}
          </div>
          <div className="tabs" role="tablist" aria-label="Result details">
            {[
              ["compatibility", "Compatibility checks"],
              ["hardware", "Hardware & requirements"],
              ["reasoning", "Why this result?"],
            ].map(([id, label]) => (
              <button
                role="tab"
                id={`tab-${id}`}
                aria-selected={activeTab === id}
                aria-controls="result-detail-panel"
                tabIndex={activeTab === id ? 0 : -1}
                key={id}
                onClick={() => setActiveTab(id)}
                onKeyDown={(event) => {
                  const tabs = ["compatibility", "hardware", "reasoning"];
                  const index = tabs.indexOf(id);
                  let next = index;
                  if (event.key === "ArrowRight")
                    next = (index + 1) % tabs.length;
                  else if (event.key === "ArrowLeft")
                    next = (index + tabs.length - 1) % tabs.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = tabs.length - 1;
                  else return;
                  event.preventDefault();
                  setActiveTab(tabs[next]);
                  document.getElementById(`tab-${tabs[next]}`)?.focus();
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            className="tab-content"
            role="tabpanel"
            id="result-detail-panel"
            tabIndex={0}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === "compatibility" && (
              <>
                {viewed.checks.length ? (
                  viewed.checks.map((check, i) => (
                    <CompatibilityCheck
                      key={`${check.item}-${i}`}
                      check={check}
                    />
                  ))
                ) : (
                  <div className="note">
                    <Icon name="info" />
                    <p>
                      No must-haves were specified. This is not evidence that
                      your apps, games, or peripherals work. Add exact names to
                      get more useful checks.
                    </p>
                  </div>
                )}
                <div className="support-key">
                  <strong>Know the difference</strong>
                  <p>
                    <b>Native:</b> built for the OS. <b>Web:</b> runs in a
                    browser, with potentially different features.{" "}
                    <b>Compatibility layer:</b> translates software built for
                    another OS, without guaranteeing support. <b>Substitute:</b>{" "}
                    a different app, not the same product.
                  </p>
                  {answers.uses.includes("gaming") && (
                    <SourceLink source={sources.proton} />
                  )}
                </div>
              </>
            )}
            {activeTab === "hardware" && (
              <>
                {viewed.excluded.length > 0 && (
                  <div className="note">
                    <Icon name="info" />
                    <p>
                      <strong>Not a primary recommendation.</strong>{" "}
                      {viewed.excluded.join(" ")}
                    </p>
                  </div>
                )}
                <h3 className="spaced-title">Published requirements</h3>
                <p>{viewed.os.requirements}</p>
                <SourceLink source={viewed.os.source} />
                <h3 className="spaced-title">
                  Device-specific support: Needs checking
                </h3>
                <ul className="hardware-list">
                  {viewed.hardware.map((item) => (
                    <li key={item}>
                      <Icon name="info" size={17} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  className="button secondary"
                  href={viewed.os.download}
                  rel="noreferrer"
                  target="_blank"
                >
                  Official download & install guidance{" "}
                  <Icon name="external" size={15} />
                </a>
              </>
            )}
            {activeTab === "reasoning" && (
              <>
                <ReasonList result={viewed} />
                <div className="note">
                  <Icon name="info" />
                  <p>
                    Device eligibility and confirmed blockers are evaluated
                    before scores. Higher points cannot override a blocker.
                    Battery life receives no ranking points without
                    device-specific evidence. Privacy, familiarity, and
                    maintenance scores are design heuristics, not measured
                    facts.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section className="shortlist-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE WHOLE PICTURE</span>
            <h2>How the other options compare.</h2>
          </div>
          <div className="filter-buttons" aria-label="Filter operating systems">
            {[
              ["all", "All options"],
              ["windows", "Windows"],
              ["macos", "macOS"],
              ["linux", "Linux"],
            ].map(([id, label]) => (
              <button
                key={id}
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="shortlist-grid">
          {results
            .filter((r) => filter === "all" || r.os.family === filter)
            .map((r) => (
              <article
                className={`shortlist-card panel ${r.excluded.length ? "excluded" : ""}`}
                key={r.os.id}
              >
                <div className="shortlist-title">
                  <OSLogo family={r.os.family} size={24} />
                  <h3>{r.os.name}</h3>
                  <span className="badge">
                    {r.excluded.length ? "Not a primary option" : "Provisional"}
                  </span>
                </div>
                <p>{r.os.description}</p>
                <details>
                  <summary>
                    {r.excluded.length
                      ? `Why it’s excluded (${r.excluded.length})`
                      : `Why it fits · ${r.score} preference points`}
                    <Icon name="chevron" size={15} />
                  </summary>
                  {r.excluded.length ? (
                    <ul>
                      {r.excluded.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <ReasonList result={r} />
                  )}
                  {r.checks.map((check, i) => (
                    <CompatibilityCheck key={i} check={check} />
                  ))}
                  <SourceLink source={r.os.source} />
                </details>
                <div className="tradeoff">
                  <strong>Trade-off</strong>
                  <p>{r.os.tradeoff}</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => {
                    setSelectedOS(r.os.id);
                    setActiveTab("hardware");
                    document
                      .querySelector(".result-detail")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  Inspect requirements <Icon name="arrow" size={15} />
                </button>
              </article>
            ))}
        </div>
      </section>

      <section className="next-steps panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A SAFER NEXT STEP</span>
            <h2>Curious? Start here, not with “erase”.</h2>
          </div>
          <span className="badge">
            {checklist.length} of {todo.length} checked
          </span>
        </div>
        <p className="next-intro">
          Changing an OS can affect app compatibility, drivers, and performance.
          There are no guaranteed speed, battery-life, or FPS improvements.
        </p>
        <div className="checklist">
          {todo.map(([id, label, detail]) => (
            <label key={id} className={checklist.includes(id) ? "done" : ""}>
              <input
                type="checkbox"
                checked={checklist.includes(id)}
                onChange={() => onCheck(id)}
              />
              <span>
                <strong>{label}</strong>
                <span>{detail}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="try-options">
          <div>
            <h3>Try a live USB</h3>
            <p>
              A USB stick that starts a temporary Linux desktop without
              installing it. Creating it erases the stick; don’t choose an
              install or erase option while trying. Check model-specific
              instructions first.
            </p>
          </div>
          <div>
            <h3>Consider dual boot carefully</h3>
            <p>
              Two operating systems on one computer, chosen at startup. Storage
              changes and boot settings can risk data. Back up files and
              recovery keys and check exact-device guidance first.
            </p>
          </div>
        </div>
      </section>
      <div className="results-bottom">
        <p>
          <Icon name="lock" size={15} /> Your answers and checklist stay in this
          browser.
        </p>
        <button className="text-button muted" onClick={onReset}>
          Clear answers & start over <Icon name="refresh" size={15} />
        </button>
      </div>
    </main>
  );
}
