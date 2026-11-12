import type { Answers, Priority } from "../lib/types";
import { Icon, OSLogo } from "./Icon";
import type { ReactNode } from "react";
import { useOptions, refineSteps, totalRefine } from "../data/quiz";
const priorityLabels: Record<Priority, string> = {
  familiarity: "Familiarity",
  battery: "Battery life",
  privacy: "Privacy",
  customization: "Customization",
  maintenance: "Low maintenance",
};

function Tile({
  selected,
  onClick,
  children,
  icon,
  detail,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  detail?: string;
}) {
  return (
    <button
      type="button"
      className={`answer-tile ${selected ? "selected" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {icon && <span className="tile-icon">{icon}</span>}
      <span className="tile-copy">
        <strong>{children}</strong>
        {detail && <span>{detail}</span>}
      </span>
      <span className="tile-check">
        {selected && <Icon name="check" size={13} />}
      </span>
    </button>
  );
}
export function Quiz({
  answers: a,
  update,
  step,
  refine,
  onBack,
  onContinue,
  onExit,
}: {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  step: number;
  refine: boolean;
  onBack: () => void;
  onContinue: () => void;
  onExit: () => void;
}) {
  const key = refine ? refineSteps[step] : undefined;
  const total = refine ? totalRefine : 3;
  const valid =
    refine ||
    (step === 0
      ? Boolean(a.device && a.currentOS)
      : step === 1
        ? a.uses.length > 0
        : true);
  const mustHaves = (
    <>
      <label className="field-label" htmlFor="must-haves">
        Essential apps, specific games, or peripherals <span>Optional</span>
      </label>
      <textarea
        id="must-haves"
        placeholder="e.g. VALORANT, Final Cut Pro, VS Code, Epson ET-2850"
        rows={4}
        value={a.mustHaves}
        maxLength={3000}
        onChange={(e) => update({ mustHaves: e.target.value })}
      />
      <p className="field-help">
        Separate items with a comma or a new line. Exact names and models help;
        unknown items will be marked “Needs checking”.
      </p>
      <div className="suggestions">
        <span>Try an example</span>
        {(a.uses.includes("gaming")
          ? ["VALORANT", "Dota 2", "VS Code"]
          : ["VS Code", "Final Cut Pro", "Photoshop"]
        ).map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => {
              if (
                !a.mustHaves
                  .split(/[,;\n]/)
                  .some((s) => s.trim().toLowerCase() === item.toLowerCase())
              )
                update({
                  mustHaves: a.mustHaves.trim()
                    ? `${a.mustHaves.trim()}, ${item}`
                    : item,
                });
            }}
          >
            + {item}
          </button>
        ))}
      </div>
      {a.uses.includes("gaming") && (
        <div className="note">
          <Icon name="game" />
          <p>
            Game names matter. A launcher working doesn’t mean every game or its
            anti-cheat will work.
          </p>
        </div>
      )}
    </>
  );
  let title = "";
  let subtitle = "";
  let content: ReactNode;
  if (!refine && step === 0) {
    title = "What device and OS do you use now?";
    subtitle = "Let’s start with what’s already on your desk.";
    content = (
      <>
        <fieldset>
          <legend>Your device</legend>
          <div className="answer-grid device-grid">
            {[
              ["pc", "PC", "Windows or Linux laptop / desktop", "monitor"],
              ["mac", "Mac", "A MacBook, iMac, or Mac desktop", "laptop"],
              [
                "other",
                "Other device",
                "Chromebook, tablet, or something else",
                "globe",
              ],
              [
                "unknown",
                "I don’t know",
                "That’s a perfectly good place to start",
                "info",
              ],
            ].map(([id, label, detail, icon]) => (
              <Tile
                key={id}
                selected={a.device === id}
                onClick={() => update({ device: id })}
                icon={<Icon name={icon} size={24} />}
                detail={detail}
              >
                {label}
              </Tile>
            ))}
          </div>
        </fieldset>
        {a.device && (
          <fieldset className="current-os">
            <legend>What operating system is on it?</legend>
            <div className="answer-grid compact-tiles">
              {[
                ["windows", "Windows"],
                ["macos", "macOS"],
                ["linux", "Linux"],
                ["other", "Other"],
                ["unknown", "I don’t know"],
              ].map(([id, label]) => (
                <Tile
                  key={id}
                  selected={a.currentOS === id}
                  onClick={() => update({ currentOS: id })}
                  icon={
                    ["windows", "macos", "linux"].includes(id) ? (
                      <OSLogo family={id} size={19} />
                    ) : undefined
                  }
                >
                  {label}
                </Tile>
              ))}
            </div>
          </fieldset>
        )}
      </>
    );
  } else if (!refine && step === 1) {
    title = "What do you mainly use it for?";
    subtitle = "Choose everything that’s part of your day.";
    content = (
      <>
        <div className="multi-label">SELECT ALL THAT APPLY</div>
        <div className="answer-grid">
          {useOptions.map((option) => (
            <Tile
              key={option.id}
              selected={a.uses.includes(option.id)}
              onClick={() =>
                update({
                  uses: a.uses.includes(option.id)
                    ? a.uses.filter((u) => u !== option.id)
                    : [...a.uses, option.id],
                })
              }
              icon={<Icon name={option.icon} size={25} />}
              detail={option.detail}
            >
              {option.name}
            </Tile>
          ))}
        </div>
      </>
    );
  } else if (!refine || key === "mustHaves") {
    title = "Is there anything you must keep using?";
    subtitle =
      "The things you rely on should come with you. Or tell us if you’re flexible.";
    content = mustHaves;
  } else if (key === "model") {
    title = "What’s your device model?";
    subtitle =
      "Optional details make the checks more specific, not automatically verified.";
    content = (
      <>
        <label className="field-label" htmlFor="model">
          Manufacturer and exact model
        </label>
        <input
          autoComplete="off"
          id="model"
          value={a.model}
          onChange={(e) => update({ model: e.target.value })}
          placeholder={
            a.device === "mac"
              ? "e.g. MacBook Air 13-inch, M2, 2022"
              : "e.g. Lenovo ThinkPad T480"
          }
          maxLength={160}
        />
        <p className="field-help">
          Windows: Settings → System → About. Mac: Apple menu → About This Mac.
          Don’t enter a serial number.
        </p>
        <button
          className={`unknown-button ${!a.model ? "active" : ""}`}
          type="button"
          onClick={() => update({ model: "" })}
        >
          I don’t know — keep this optional
        </button>
      </>
    );
  } else if (key === "cpu") {
    title = "Which processor does it have?";
    subtitle =
      "The CPU is your computer’s main processing chip. Skip anything you don’t know.";
    content = (
      <>
        <label className="field-label" htmlFor="cpu">
          CPU model <span>Optional</span>
        </label>
        <input
          id="cpu"
          value={a.cpu}
          onChange={(e) => update({ cpu: e.target.value })}
          placeholder="e.g. Intel Core i5-8250U, AMD Ryzen 5 5600, Apple M2"
          maxLength={160}
        />
        <fieldset className="current-os">
          <legend>Processor type, if you know it</legend>
          <div className="answer-grid compact-tiles">
            {[
              ["x64", "Intel / AMD 64-bit"],
              ["arm", "ARM / Apple silicon"],
              ["", "I don’t know"],
            ].map(([id, label]) => (
              <Tile
                key={id}
                selected={a.architecture === id}
                onClick={() => update({ architecture: id })}
              >
                {label}
              </Tile>
            ))}
          </div>
        </fieldset>
        <p className="field-help">
          A chip family alone doesn’t prove OS compatibility. We’ll still flag
          model-specific checks.
        </p>
      </>
    );
  } else if (key === "gpu") {
    title = "What handles your graphics?";
    subtitle =
      "The GPU draws what you see on screen. Its drivers matter for games and creative apps.";
    content = (
      <>
        <label className="field-label" htmlFor="gpu">
          GPU model <span>Optional</span>
        </label>
        <input
          id="gpu"
          value={a.gpu}
          onChange={(e) => update({ gpu: e.target.value })}
          placeholder="e.g. NVIDIA RTX 3060, Intel UHD 620, Apple M2"
          maxLength={160}
        />
        <p className="field-help">
          Windows: Task Manager → Performance → GPU. Mac: About This Mac.
          Include both graphics chips if your laptop has two.
        </p>
        <button
          className={`unknown-button ${!a.gpu ? "active" : ""}`}
          onClick={() => update({ gpu: "" })}
          type="button"
        >
          I don’t know
        </button>
      </>
    );
  } else if (key === "ram") {
    title = "How much memory does it have?";
    subtitle =
      "RAM is temporary workspace for your open apps, not the space where you save files.";
    content = (
      <div className="answer-grid compact-tiles">
        {["1", "2", "4", "6", "8", "16", "32", "64", ""].map((value) => (
          <Tile
            key={value}
            selected={a.ram === value}
            onClick={() => update({ ram: value })}
          >
            {value
              ? `${value} GB${value === "64" ? " or more" : ""}`
              : "I don’t know"}
          </Tile>
        ))}
      </div>
    );
  } else if (key === "storage") {
    title = "How much storage can you make available?";
    subtitle =
      "Free space is room for the OS, apps, updates, and your files — not the drive’s total capacity.";
    content = (
      <>
        <label className="field-label" htmlFor="storage">
          Available space in GB <span>Optional</span>
        </label>
        <input
          id="storage"
          type="number"
          min="1"
          max="100000"
          value={a.storage}
          onChange={(e) => update({ storage: e.target.value })}
          placeholder="e.g. 128"
        />
        <p className="field-help">
          An installer’s minimum is not enough room for every app or game. Leave
          space for updates and your own files.
        </p>
        <button
          type="button"
          className={`unknown-button ${!a.storage ? "active" : ""}`}
          onClick={() => update({ storage: "" })}
        >
          I don’t know
        </button>
      </>
    );
  } else if (key === "alternatives") {
    title = "Are web versions or alternatives okay?";
    subtitle =
      "A different way to do a task isn’t always a replacement for the exact app you need.";
    content = (
      <div className="answer-grid one-column">
        {[
          [
            "native",
            "Keep my exact desktop apps and games",
            "No substitutions. Confirmed incompatibilities rule out an OS.",
          ],
          [
            "web",
            "Web versions are okay",
            "Only if my required features work. Unknown web support stays unverified.",
          ],
          [
            "alternatives",
            "I’m open to different apps",
            "A substitute must still be tested with my real files and workflow.",
          ],
        ].map(([id, label, detail]) => (
          <Tile
            key={id}
            selected={a.alternatives === id}
            onClick={() => update({ alternatives: id })}
            detail={detail}
          >
            {label}
          </Tile>
        ))}
      </div>
    );
  } else if (key === "priorities") {
    title = "What matters most in your next setup?";
    subtitle = "Set each priority independently. There’s no right combination.";
    content = (
      <>
        <div className="priority-list">
          {(Object.entries(priorityLabels) as [Priority, string][]).map(
            ([key, label]) => (
              <div className="priority-row" key={key}>
                <label htmlFor={`priority-${key}`}>
                  {label}
                  <span>
                    {
                      [
                        "Not a priority",
                        "Somewhat important",
                        "Very important",
                      ][a.priorities[key]]
                    }
                  </span>
                </label>
                <input
                  id={`priority-${key}`}
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={a.priorities[key]}
                  onChange={(e) =>
                    update({
                      priorities: {
                        ...a.priorities,
                        [key]: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            ),
          )}
        </div>
        <div className="note">
          <Icon name="info" />
          <p>
            Battery life depends on your exact device, drivers, and workload. We
            won’t award an OS “battery points” without device-specific evidence.
          </p>
        </div>
      </>
    );
  } else {
    title = "How do you feel about switching and troubleshooting?";
    subtitle =
      "An honest answer helps us suggest a setup you’ll actually enjoy.";
    content = (
      <div className="answer-grid one-column">
        {[
          [
            "new",
            "I’d like things to be straightforward",
            "I’m new to installing an OS or would rather avoid troubleshooting.",
          ],
          [
            "learning",
            "I’m happy to learn a few new things",
            "I can follow a guide and spend some time getting set up.",
          ],
          [
            "confident",
            "I’m comfortable exploring and fixing things",
            "I don’t mind hands-on setup or more frequent upgrades.",
          ],
        ].map(([id, label, detail]) => (
          <Tile
            key={id}
            selected={a.comfort === id}
            onClick={() => update({ comfort: id })}
            detail={detail}
          >
            {label}
          </Tile>
        ))}
      </div>
    );
  }
  return (
    <main className="quiz-page section-width" id="main">
      <div className="quiz-top">
        <button className="text-button muted" onClick={onExit}>
          <Icon name="close" size={16} /> Save & exit
        </button>
        <span>{refine ? "A LITTLE MORE PERSONAL" : "LET’S FIND YOUR FIT"}</span>
        <span className="quiz-time">
          <Icon name="clock" size={14} />{" "}
          {refine ? "All details optional" : "About 2 minutes"}
        </span>
      </div>
      <div className="quiz-progress">
        <div>
          <span>{refine ? "Refine your result" : "Your quick quiz"}</span>
          <span>
            Question {step + 1} of {total}
          </span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={step + 1}
        >
          <span style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
      </div>
      <form
        className="quiz-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onContinue();
        }}
      >
        <span className="question-number">
          {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <h1 tabIndex={-1} className="screen-title">
          {title}
        </h1>
        <p className="quiz-subtitle">{subtitle}</p>
        <div className="quiz-content">{content}</div>
        <div className="quiz-actions">
          <button type="button" className="button secondary" onClick={onBack}>
            <Icon name="back" size={17} /> Back
          </button>
          <div>
            {!refine && step === 2 && !a.mustHaves.trim() && (
              <span className="skip-label">You can skip this one</span>
            )}
            <button className="button primary" type="submit" disabled={!valid}>
              {step === total - 1
                ? refine
                  ? "Update my results"
                  : "See my results"
                : "Continue"}
              <Icon name="arrow" size={18} />
            </button>
          </div>
        </div>
      </form>
      <p className="quiz-privacy">
        <Icon name="lock" size={14} /> Only saved in this browser. No account,
        no uploads.
      </p>
    </main>
  );
}
