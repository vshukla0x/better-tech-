import { useEffect, useRef, useState } from "react";
import { Home } from "./components/Home";
import { Quiz } from "./components/Quiz";
import { totalRefine } from "./data/quiz";
import { Results } from "./components/Results";
import { Icon } from "./components/Icon";
import { emptyAnswers } from "./lib/types";
import type { Answers } from "./lib/types";
import "./App.css";
import "./accessibility.css";

const STORAGE_KEY = "better-tech-v1";
type View = "home" | "quiz" | "refine" | "results";
interface Saved {
  answers: Answers;
  checklist: string[];
  completed: boolean;
}
function loadSaved(): Saved {
  const fallback = {
    answers: { ...emptyAnswers, priorities: { ...emptyAnswers.priorities } },
    checklist: [],
    completed: false,
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || !saved.answers) return fallback;
    const a = saved.answers;
    const answers: Answers = { ...fallback.answers };
    for (const key of [
      "device",
      "currentOS",
      "mustHaves",
      "model",
      "cpu",
      "gpu",
      "ram",
      "storage",
      "architecture",
      "alternatives",
      "comfort",
    ] as const)
      if (typeof a[key] === "string") answers[key] = a[key].slice(0, 3000);
    if (Array.isArray(a.uses))
      answers.uses = a.uses.filter(
        (s: unknown) =>
          typeof s === "string" &&
          [
            "gaming",
            "study",
            "programming",
            "creation",
            "browsing",
            "older",
          ].includes(s),
      );
    for (const key of Object.keys(
      answers.priorities,
    ) as (keyof Answers["priorities"])[])
      if ([0, 1, 2].includes(a.priorities?.[key]))
        answers.priorities[key] = a.priorities[key];
    answers.refined = a.refined === true;
    return {
      answers,
      checklist: Array.isArray(saved.checklist)
        ? saved.checklist.filter(
            (s: unknown) =>
              typeof s === "string" &&
              ["backup", "apps", "hardware", "recovery"].includes(s),
          )
        : [],
      completed: saved.completed === true,
    };
  } catch {
    return fallback;
  }
}

function App() {
  const [initial] = useState(loadSaved);
  const [answers, setAnswers] = useState(initial.answers);
  const [checklist, setChecklist] = useState<string[]>(initial.checklist);
  const [completed, setCompleted] = useState(initial.completed);
  const [view, setView] = useState<View>("home");
  const [step, setStep] = useState(0);
  const [storageError, setStorageError] = useState(false);
  const [modal, setModal] = useState<"privacy" | "reset" | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, checklist, completed }),
      );
    } catch {
      // This effect reports an external storage failure, rather than deriving UI state.
      // oxlint-disable-next-line react/set-state-in-effect
      setStorageError(true);
    }
  }, [answers, checklist, completed]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document
      .querySelector<HTMLElement>(".screen-title")
      ?.focus({ preventScroll: true });
    document.title =
      view === "home"
        ? "Better Tech — Find the right OS for your PC or Mac"
        : `${view === "results" ? "Your OS recommendation" : "Find your fit"} — Better Tech`;
  }, [view, step]);
  useEffect(() => {
    if (modal) dialog.current?.showModal();
    else dialog.current?.close();
  }, [modal]);
  const go = (next: View, nextStep = 0) => {
    setView(next);
    setStep(nextStep);
  };
  const explore = () => {
    setView("home");
    requestAnimationFrame(() =>
      document
        .getElementById("explore")
        ?.scrollIntoView({ behavior: "smooth" }),
    );
  };
  const update = (patch: Partial<Answers>) => {
    setAnswers((a) => ({ ...a, ...patch }));
    setChecklist([]);
  };
  const next = () => {
    const last = view === "refine" ? totalRefine - 1 : 2;
    if (step < last) setStep((s) => s + 1);
    else {
      setCompleted(true);
      if (view === "refine") setAnswers((a) => ({ ...a, refined: true }));
      go("results");
    }
  };
  const reset = () => {
    setAnswers({ ...emptyAnswers, priorities: { ...emptyAnswers.priorities } });
    setChecklist([]);
    setCompleted(false);
    setModal(null);
    go("quiz");
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner section-width">
          <button
            className="wordmark"
            onClick={() => go("home")}
            aria-label="bettertech. — Better Tech home"
          >
            <span className="brand-mark">
              <span />
              <span />
              <span />
              <span />
            </span>
            better<span className="wordmark-light">tech</span>
            <span className="brand-dot">.</span>
          </button>
          <nav aria-label="Main navigation">
            {completed && (
              <button className="nav-result" onClick={() => go("results")}>
                My result
              </button>
            )}
            <button className="nav-explore" onClick={explore}>
              Explore OS Options <Icon name="arrow" size={15} />
            </button>
            <button className="header-start" onClick={() => go("quiz")}>
              Find my fit <Icon name="arrow" size={15} />
            </button>
          </nav>
        </div>
      </header>
      {storageError && (
        <div className="storage-warning" role="status">
          Your browser blocked saving. You can still use the quiz, but answers
          may be lost on refresh.
        </div>
      )}
      {view === "home" ? (
        <main id="main">
          <Home onStart={() => go("quiz")} />
        </main>
      ) : view === "results" ? (
        <Results
          answers={answers}
          checklist={checklist}
          onCheck={(id) =>
            setChecklist((c) =>
              c.includes(id) ? c.filter((i) => i !== id) : [...c, id],
            )
          }
          onRefine={() => go("refine")}
          onEdit={() => go("quiz")}
          onReset={() => setModal("reset")}
        />
      ) : (
        <Quiz
          answers={answers}
          update={update}
          step={step}
          refine={view === "refine"}
          onContinue={next}
          onBack={() =>
            step
              ? setStep((s) => s - 1)
              : go(view === "refine" ? "results" : "home")
          }
          onExit={() => go("home")}
        />
      )}
      <footer className="site-footer section-width">
        <div>
          <button className="footer-brand" onClick={() => go("home")}>
            better tech.
          </button>
          <span>Better choices. Not more complicated ones.</span>
        </div>
        <div>
          <span>Independent by design.</span>
          <button onClick={() => setModal("privacy")}>
            Privacy & your data
          </button>
          <span>© 2026 Better Tech</span>
        </div>
      </footer>
      <dialog
        ref={dialog}
        className="app-dialog"
        onCancel={() => setModal(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModal(null);
        }}
        aria-labelledby="dialog-title"
      >
        <button
          className="dialog-close"
          aria-label="Close dialog"
          onClick={() => setModal(null)}
        >
          <Icon name="close" />
        </button>
        {modal === "privacy" ? (
          <>
            <span className="icon-box">
              <Icon name="lock" />
            </span>
            <h2 id="dialog-title">Your setup stays yours.</h2>
            <p>
              Your quiz answers and checklist are saved in this browser’s local
              storage so you can come back to them. There’s no account, server
              upload, analytics, or automatic hardware scanning.
            </p>
            <p>
              Official-source links open third-party websites, which have their
              own privacy policies. Clearing browser data removes your saved
              answers.
            </p>
            <button
              className="button secondary"
              onClick={() => setModal("reset")}
            >
              Clear my saved answers
            </button>
          </>
        ) : (
          <>
            <h2 id="dialog-title">Start with a clean slate?</h2>
            <p>
              This clears your Better Tech answers, result, and checklist in
              this browser. It won’t change anything on your computer.
            </p>
            <div className="dialog-actions">
              <button
                className="button secondary"
                onClick={() => setModal(null)}
              >
                Keep my answers
              </button>
              <button className="button primary" onClick={reset}>
                Clear & start over
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
export default App;
