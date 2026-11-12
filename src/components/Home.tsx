import { Icon, OSLogo } from "./Icon";
import { operatingSystems } from "../data/compatibility";
import { SourceLink } from "./SourceLink";
import { useState } from "react";

export function Home({ onStart }: { onStart: () => void }) {
  const [showDistros, setShowDistros] = useState(false);
  const families = [
    operatingSystems[0],
    operatingSystems[1],
    {
      ...operatingSystems[2],
      name: "Linux",
      subtitle: "Your computer. Your choice.",
      description:
        "A family of open-source operating systems, with different desktops and approaches to updates.",
      strengths: [
        "Flexible desktop choices",
        "Open-source development tools",
        "Free distributions to explore",
      ],
      tradeoff:
        "Some apps, games, and hardware need extra checks. Choosing a distribution is part of the process.",
    },
  ];
  return (
    <>
      <section className="hero section-width">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="little-dot" /> YOUR COMPUTER. YOUR KIND OF OS.
          </span>
          <h1>
            Find the right OS <br />
            for your <span>PC or Mac.</span>
          </h1>
          <p className="hero-description">
            A recommendation built around your device, the apps you need, and
            what you do every day.
          </p>
          <button className="button primary hero-button" onClick={onStart}>
            Find My OS <Icon name="arrow" />
          </button>
          <div className="hero-meta">
            <span>
              <Icon name="clock" size={15} /> About 2 minutes
            </span>
            <i />
            No sign-up. No tech expertise needed.
          </div>
          <div className="hero-families">
            <span>One honest comparison.</span>
            <span>
              <OSLogo family="windows" size={16} /> Windows
            </span>
            <span>
              <OSLogo family="macos" size={16} /> macOS
            </span>
            <span>
              <OSLogo family="linux" size={17} /> Linux
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orbital orbit-one" />
          <div className="orbital orbit-two" />
          <div className="floating-label label-top">
            <Icon name="monitor" size={16} /> Your hardware matters
          </div>
          <div className="example-result">
            <div className="example-top">
              <span>
                <Icon name="spark" size={15} /> Example result
              </span>
              <span className="badge">Provisional</span>
            </div>
            <div className="example-os">
              <div className="os-icon">
                <OSLogo family="linux" size={36} />
              </div>
              <div>
                <h2>Linux Mint</h2>
                <p>A starting point worth exploring</p>
              </div>
            </div>
            <div className="desktop-preview" aria-hidden="true">
              <div className="desktop-menu">
                <span>● &nbsp; Applications</span>
                <span>◉ &nbsp; ▰ &nbsp; 10:24</span>
              </div>
              <div className="desktop-shape shape-one" />
              <div className="desktop-shape shape-two" />
              <div className="desktop-window">
                <div className="window-bar">
                  <span>Welcome home</span>
                  <span>− &nbsp; ×</span>
                </div>
                <div className="window-content">
                  <Icon name="leaf" size={29} />
                  <div>
                    <strong>A little more you.</strong>
                    <span>A familiar place to get things done.</span>
                  </div>
                </div>
                <div className="mini-tiles">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="desktop-dock">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="example-line">
              <span className="round-check">
                <Icon name="check" size={13} />
              </span>
              <div>
                <strong>A familiar desktop layout</strong>
                <p>For browsing, study, and everyday work.</p>
              </div>
            </div>
            <div className="example-line example-check">
              <Icon name="info" size={17} />
              <div>
                <strong>Check before switching</strong>
                <p>Test your Wi-Fi and essential apps first.</p>
              </div>
            </div>
            <div className="example-bottom">
              Your result will depend on your answers.
              <Icon name="tune" size={15} />
            </div>
          </div>
          <div className="floating-label label-bottom">
            <Icon name="shield" size={16} /> Compatibility first. Preferences
            second.
          </div>
        </div>
      </section>

      <div className="trust-strip section-width">
        <span>
          <Icon name="shield" /> No OS bias
        </span>
        <span>
          <Icon name="tune" /> Clear reasons, not a black box
        </span>
        <span>
          <Icon name="lock" /> Your answers stay in your browser
        </span>
      </div>

      <section className="how-section section-width" id="how-it-works">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</span>
            <h2>Less guesswork. A better fit.</h2>
          </div>
          <p>
            You don’t need to know everything about your
            <br className="desktop-only" /> computer. We’ll figure out what
            matters together.
          </p>
        </div>
        <div className="steps-grid">
          {[
            [
              "01",
              "monitor",
              "Tell us about your setup",
              "Your device, your everyday tasks, and anything you can’t do without.",
            ],
            [
              "02",
              "tune",
              "See what fits, and why",
              "Get a clear recommendation with real trade-offs and compatibility checks.",
            ],
            [
              "03",
              "leaf",
              "Explore at your own pace",
              "Refine your result, compare your options, and know what to check next.",
            ],
          ].map(([number, icon, title, text]) => (
            <div className="step-card" key={number}>
              <div className="step-card-top">
                <span className="icon-box">
                  <Icon name={icon} size={22} />
                </span>
                <span className="step-number">{number}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="explore-section" id="explore">
        <div className="section-width">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                DIFFERENT SYSTEMS. DIFFERENT STRENGTHS.
              </span>
              <h2>Meet your options.</h2>
            </div>
            <span className="quiet-label">
              No single OS is best for everyone.
            </span>
          </div>
          <div className="family-grid">
            {families.map((os) => (
              <article className="family-card" key={os.id}>
                <div className="family-title">
                  <OSLogo family={os.family} size={31} />
                  <h3>{os.name}</h3>
                </div>
                <h4>{os.subtitle}</h4>
                <p>{os.description}</p>
                <ul>
                  {os.strengths.map((s) => (
                    <li key={s}>
                      <Icon name="check" size={15} />
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="tradeoff">
                  <strong>Keep in mind</strong>
                  <p>{os.tradeoff}</p>
                </div>
                {os.family !== "linux" ? (
                  <SourceLink source={os.source} compact />
                ) : (
                  <button
                    className="text-button"
                    onClick={() => setShowDistros(!showDistros)}
                    aria-expanded={showDistros}
                  >
                    {showDistros ? "Hide" : "Explore"} Linux distributions{" "}
                    <Icon name="arrow" size={16} />
                  </button>
                )}
              </article>
            ))}
          </div>
          <p className="term-note">
            <Icon name="info" size={16} />
            <span>
              A <strong>Linux distro</strong> (short for distribution) is a
              ready-to-use version of Linux, with its own desktop, apps, and
              update tools.
            </span>
          </p>
          {showDistros && (
            <div className="distro-grid">
              {operatingSystems
                .filter((o) => o.family === "linux")
                .map((os) => (
                  <article className="panel" key={os.id}>
                    <h3>{os.name}</h3>
                    <p>{os.description}</p>
                    <p className="small">{os.tradeoff}</p>
                    <SourceLink source={os.source} />
                  </article>
                ))}
            </div>
          )}
        </div>
      </section>

      <section className="faq-section section-width" id="questions">
        <div>
          <span className="eyebrow">NO QUESTION TOO BASIC</span>
          <h2>
            A new OS. <br />
            Not a leap of faith.
          </h2>
          <p>
            Start with a little understanding.
            <br />
            Switch only when you’re ready.
          </p>
          <div className="faq-decoration" aria-hidden="true">
            <Icon name="globe" size={52} />
            <span>
              Start curious.
              <br />
              <strong>Stay in control.</strong>
            </span>
          </div>
        </div>
        <div className="faq-list">
          {[
            [
              "What is an operating system, exactly?",
              "An operating system (OS) is the main software that runs your computer. It manages your hardware, opens your apps, and gives you the desktop you interact with. Windows, macOS, and Linux are different choices for that foundation.",
            ],
            [
              "Will changing my OS make my computer faster?",
              "Not necessarily. Drivers, hardware, app versions, and your workload all affect performance. A lighter desktop may use fewer resources, but we don’t promise speed, battery-life, or FPS gains. Test your actual tasks before deciding.",
            ],
            [
              "Can I try Linux without replacing my current OS?",
              "Often, on a supported PC. A live USB is a USB stick that starts a temporary Linux desktop so you can try it without installing. Creating the stick erases its contents. Back up your files first, use the official guide, and don’t choose an install or erase option while trying it. Macs and some PCs need model-specific instructions.",
            ],
            [
              "What does “dual boot” mean?",
              "Dual boot means keeping two operating systems on one computer and choosing one when you start it. It can help you keep essential apps, but dividing storage and changing boot settings carries risks. Back up your files and recovery keys, and check a device-specific guide before changing anything.",
            ],
            [
              "How does Better Tech choose a recommendation?",
              "First we check device eligibility and known must-have blockers. Then we score the remaining choices against your activities, priorities, and comfort with switching. You can see every scoring rule in your results. Unknown support stays “Needs checking”; a preference never overrides a confirmed blocker.",
            ],
          ].map(([q, answer]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="bottom-cta section-width">
        <div>
          <h2>Your next setup starts with you.</h2>
          <p>A few questions. A clearer direction. No pressure to switch.</p>
        </div>
        <button className="button primary" onClick={onStart}>
          Find My OS <Icon name="arrow" />
        </button>
      </section>
    </>
  );
}
