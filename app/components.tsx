"use client";

import { useState, useEffect, useRef, useMemo, type CSSProperties, type ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";

/* ─── LOGO ─── */
export function Logo({ size = 64 }: { size?: number }) {
  const fontSize = Math.round(size * 0.45);
  return (
    <div
      className="relative rounded-full flex items-center justify-center logo-ring mx-auto"
      style={{
        width: size,
        height: size,
        background: "#1E2330",
        border: `${Math.max(3, Math.round(size * 0.04))}px solid #3B82F6`,
      }}
    >
      <span
        className="font-bold text-white select-none"
        style={{ fontSize, lineHeight: 1 }}
      >
        M
      </span>
    </div>
  );
}

/* ─── AI BADGE PILL ─── */
export function AiBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="badge-pill"
      style={{ backgroundColor: color }}
    >
      {name}
    </span>
  );
}

/* ─── FEATURE CARD ─── */
export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#252B3B] rounded-xl p-6 border border-[#374151] feature-card">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-[#E8EDF3] mb-2">{title}</h3>
      <p className="text-sm text-[#8B95A8] leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── STEP CARD ─── */
export function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="relative bg-[#252B3B] rounded-xl p-6 border border-[#374151]">
      <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold text-lg mb-4">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-[#E8EDF3] mb-2">{title}</h3>
      <p className="text-sm text-[#8B95A8] leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── STAT CARD ─── */
export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl sm:text-4xl font-bold text-[#3B82F6]">{value}</p>
      <p className="text-sm text-[#8B95A8] mt-1">{label}</p>
    </div>
  );
}

/* ─── SECTION HEADING ─── */
export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-[#E8EDF3]">
        {title}
      </h2>
      <p className="mt-3 text-lg text-[#8B95A8]">{subtitle}</p>
    </div>
  );
}

/* ─── NAV ─── */
export function Nav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1E2330]/90 backdrop-blur-md border-b border-[#374151]/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <a href="/" className="flex items-center gap-3">
          <Logo size={36} />
          <span className="text-lg font-bold text-[#E8EDF3]">MakoBot</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#how-it-works"
            className="text-sm text-[#8B95A8] hover:text-[#E8EDF3] transition-colors"
          >
            How It Works
          </a>
          <a
            href="/#features"
            className="text-sm text-[#8B95A8] hover:text-[#E8EDF3] transition-colors"
          >
            Features
          </a>
          <a
            href="/compare"
            className="text-sm text-[#8B95A8] hover:text-[#E8EDF3] transition-colors"
          >
            Compare
          </a>
          <a
            href="/exchange"
            className="relative text-sm font-semibold text-white px-3 py-1 rounded-full bg-gradient-to-r from-[#3B82F6] via-[#EC4899] to-[#F59E0B] hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all"
          >
            Skills Exchange
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#10B981] border-2 border-[#1E2330]"></span>
            </span>
          </a>
          <a
            href="/#download"
            className="inline-flex items-center px-5 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold transition-colors"
          >
            Download
          </a>
          {session?.user?.isAdmin && (
            <a
              href="/admin"
              className="text-sm text-[#8B95A8] hover:text-[#E8EDF3] transition-colors"
            >
              Admin
            </a>
          )}
          {session?.user && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-[#8B95A8] hover:text-[#DC2626] transition-colors"
              title="Sign out"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#8B95A8] hover:text-[#E8EDF3] p-2"
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-[#252B3B] border-t border-[#374151] px-6 py-4 flex flex-col gap-4">
          <a
            href="/#how-it-works"
            onClick={() => setOpen(false)}
            className="text-sm text-[#C0C8D8]"
          >
            How It Works
          </a>
          <a
            href="/#features"
            onClick={() => setOpen(false)}
            className="text-sm text-[#C0C8D8]"
          >
            Features
          </a>
          <a
            href="/compare"
            onClick={() => setOpen(false)}
            className="text-sm text-[#C0C8D8]"
          >
            Compare
          </a>
          <a
            href="/exchange"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-full bg-gradient-to-r from-[#3B82F6] via-[#EC4899] to-[#F59E0B] w-fit"
          >
            Skills Exchange
            <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
          </a>
          <a
            href="/#download"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-semibold"
          >
            Download
          </a>
          {session?.user?.isAdmin && (
            <a
              href="/admin"
              onClick={() => setOpen(false)}
              className="text-sm text-[#8B95A8]"
            >
              Admin
            </a>
          )}
          {session?.user && (
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
              className="text-sm text-[#DC2626] text-left"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

/* ─── FOOTER ─── */
export function Footer() {
  return (
    <footer className="border-t border-[#374151]/50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <p className="text-sm font-semibold text-[#E8EDF3]">MakoBot</p>
              <p className="text-xs text-[#6B7280]">by <a href="https://makologics.com" target="_blank" rel="noopener" className="hover:text-[#C0C8D8] transition-colors">Mako Logics</a></p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-[#8B95A8] mb-1">
              Part of the{" "}
              <span className="text-[#E8EDF3] font-medium">MakoBytes</span>{" "}
              product family
            </p>
            <div className="flex gap-4 text-xs text-[#6B7280]">
              <a href="https://www.makobytes.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C0C8D8] transition-colors">PromptPixel</a>
              <span>·</span>
              <a href="https://aipromptshive.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C0C8D8] transition-colors">AI Prompt Hive</a>
              <span>·</span>
              <span className="text-[#3B82F6]">MakoBot</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#374151]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#4B5563]">
            &copy; {new Date().getFullYear()} Mako Logics. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-[#6B7280]">
            <a href="/privacy" className="hover:text-[#C0C8D8] transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#C0C8D8] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── WALKTHROUGH ─── */
type WalkScene =
  | { kind: "title" }
  | { kind: "cta" }
  | {
      kind: "shot";
      src: string;
      alt: string;
      pan: "tl" | "tr" | "bd";
      head: ReactNode;
      sub?: ReactNode;
    };

const WALK_SCENES: { dur: number; scene: WalkScene }[] = [
  { dur: 3000, scene: { kind: "title" } },
  {
    dur: 5000,
    scene: {
      kind: "shot",
      src: "/images/walkthrough/01-about.webp",
      alt: "MakoBot About tab — three pillars: Memory, AI Tools, Skills",
      pan: "tl",
      head: "Three pillars. One workbench.",
      sub: (
        <>
          <span className="text-[#06B6D4]">Memory</span>{" "}·{" "}
          <span className="text-[#06B6D4]">AI Tools</span>{" "}·{" "}
          <span className="text-[#06B6D4]">Skills</span>
        </>
      ),
    },
  },
  {
    dur: 5500,
    scene: {
      kind: "shot",
      src: "/images/walkthrough/02-activity.webp",
      alt: "MakoBot Activity tab — live dashboard",
      pan: "tr",
      head: "Live dashboard.",
      sub: "Every project, every commit, every AI session — tracked in real time.",
    },
  },
  {
    dur: 4500,
    scene: {
      kind: "shot",
      src: "/images/walkthrough/03-projects.webp",
      alt: "MakoBot Projects tab — auto-discovered projects with git history",
      pan: "tl",
      head: "Auto-discovers every project.",
      sub: "Full git history and AI session memory, per project.",
    },
  },
  {
    dur: 5000,
    scene: {
      kind: "shot",
      src: "/images/walkthrough/04-notes.webp",
      alt: "MakoBot Notes tab — manual project decisions and context",
      pan: "bd",
      head: "Capture decisions the moment you make them.",
      sub: "Context that doesn't belong in code — saved to the right project automatically.",
    },
  },
  {
    dur: 5000,
    scene: {
      kind: "shot",
      src: "/images/walkthrough/05-skills.webp",
      alt: "MakoBot Skills tab — reusable AI behavior library",
      pan: "tr",
      head: "Reusable AI behaviors.",
      sub: "Write a skill once — every AI tool picks it up automatically.",
    },
  },
  {
    dur: 5000,
    scene: {
      kind: "shot",
      src: "/images/walkthrough/06-commands.webp",
      alt: "MakoBot Commands tab — God Mode hard rules",
      pan: "tl",
      head: "Hard rules every AI tool obeys.",
      sub: "Write them once. Every project, every session, forever.",
    },
  },
  {
    dur: 7000,
    scene: {
      kind: "shot",
      src: "/images/walkthrough/07-plugins.webp",
      alt: "MakoBot AI Tools — multi-model orchestration plug-ins",
      pan: "bd",
      head: "Five trigger words.",
      sub: (
        <>
          <span className="text-[#06B6D4]">@verify</span>{" "}·{" "}
          <span className="text-[#06B6D4]">@audit</span>{" "}·{" "}
          <span className="text-[#06B6D4]">@codereview</span>{" "}·{" "}
          <span className="text-[#06B6D4]">@designreview</span>{" "}·{" "}
          <span className="text-[#06B6D4]">@contractreview</span>
        </>
      ),
    },
  },
  {
    dur: 5000,
    scene: {
      kind: "shot",
      src: "/images/walkthrough/08-providers.webp",
      alt: "MakoBot AI Tools — bring your own keys for OpenAI, Google, Anthropic",
      pan: "tr",
      head: "Bring your own keys.",
      sub: "OpenAI, Google, Anthropic — any combination. Your bills, your data.",
    },
  },
  {
    dur: 4500,
    scene: {
      kind: "shot",
      src: "/images/walkthrough/09-prefs.webp",
      alt: "MakoBot AI Tools Preferences — plain-English working style",
      pan: "tl",
      head: "Write your style once.",
      sub: "Every AI tool gets briefed automatically — every session.",
    },
  },
  {
    dur: 4500,
    scene: {
      kind: "shot",
      src: "/images/walkthrough/10-privacy.webp",
      alt: "MakoBot Privacy tab — 100% local, no servers, no cloud",
      pan: "bd",
      head: "100% local.",
      sub: "Zero servers. Zero cloud. Zero accounts. Zero telemetry.",
    },
  },
  { dur: 6000, scene: { kind: "cta" } },
];

const WALK_TOTAL_MS = WALK_SCENES.reduce((s, x) => s + x.dur, 0);

export function Walkthrough() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startTsRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Pre-compute scene start times so we can map elapsed ms → scene idx in O(scenes)
  const offsets = useMemo(() => {
    const acc: number[] = [];
    let sum = 0;
    for (const s of WALK_SCENES) {
      acc.push(sum);
      sum += s.dur;
    }
    return acc;
  }, []);

  // IntersectionObserver — only animate when visible (saves CPU off-screen)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setRunning(entry.isIntersecting);
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    if (!running) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }
    // Resume from current scene without restarting from 0
    const offsetForActive = offsets[active] ?? 0;
    startTsRef.current = performance.now() - offsetForActive;

    const tick = () => {
      const now = performance.now();
      let elapsed = now - startTsRef.current;
      if (elapsed >= WALK_TOTAL_MS) {
        // Loop: reset start timestamp
        startTsRef.current = now;
        elapsed = 0;
      }
      // Find current scene index
      let idx = 0;
      for (let i = WALK_SCENES.length - 1; i >= 0; i--) {
        if (elapsed >= offsets[i]) {
          idx = i;
          break;
        }
      }
      setActive((prev) => (prev === idx ? prev : idx));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [running, offsets, active]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] rounded-xl shadow-2xl border border-[#374151]/50 overflow-hidden bg-[#0d1117]"
      role="img"
      aria-label="MakoBot product walkthrough — animated tour of the dashboard, AI tools, and privacy features"
    >
      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background:
               "radial-gradient(circle at 30% 20%, rgba(59,130,246,0.10), transparent 50%), radial-gradient(circle at 70% 80%, rgba(6,182,212,0.08), transparent 50%)",
           }}
      />

      {/* wordmark */}
      <div className="absolute top-3 left-4 z-30 flex items-center gap-2 opacity-80 pointer-events-none">
        <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-black text-sm"
             style={{ background: "linear-gradient(135deg, #06B6D4, #3B82F6)", boxShadow: "0 4px 12px rgba(59,130,246,0.4)" }}>
          M
        </div>
        <span className="text-white font-bold text-sm tracking-wide">
          MakoBot <span className="text-[#94A3B8] font-normal text-xs ml-1">Build 104</span>
        </span>
      </div>

      {/* scenes */}
      {WALK_SCENES.map((entry, idx) => {
        const isActive = idx === active;
        const dur = entry.dur;
        const sc = entry.scene;
        const baseOpacity: CSSProperties = {
          opacity: isActive ? 1 : 0,
          transition: "opacity 600ms ease-in-out",
        };

        if (sc.kind === "title") {
          return (
            <div key={idx} className="absolute inset-0 flex flex-col items-center justify-center" style={baseOpacity}>
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white font-black text-4xl sm:text-5xl ${isActive ? "animate-pulse" : ""}`}
                style={{
                  background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                  boxShadow: "0 20px 50px rgba(59,130,246,0.5), inset 0 2px 0 rgba(255,255,255,0.2)",
                }}
              >
                M
              </div>
              <div className="mt-6 text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-b from-white to-[#94A3B8] bg-clip-text text-transparent">
                MakoBot
              </div>
              <div className="mt-2 text-sm sm:text-lg text-[#06B6D4] font-medium">
                Your local AI Workbench
              </div>
            </div>
          );
        }

        if (sc.kind === "cta") {
          return (
            <div key={idx} className="absolute inset-0 flex items-center justify-center px-6" style={baseOpacity}>
              <div
                className="text-center rounded-2xl px-6 sm:px-12 py-8 sm:py-10 max-w-xl"
                style={{
                  background: "linear-gradient(180deg, rgba(37,43,59,0.9), rgba(13,17,23,0.95))",
                  border: "1px solid rgba(59,130,246,0.3)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="text-2xl sm:text-4xl font-black leading-tight bg-gradient-to-b from-white to-[#CBD5E1] bg-clip-text text-transparent">
                  Stop losing<br />your AI work.
                </div>
                <div
                  className={`inline-flex mt-6 px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-lg ${isActive ? "animate-pulse" : ""}`}
                  style={{
                    background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                    boxShadow: "0 12px 32px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  Download for Windows · Free
                </div>
                <div className="mt-4 text-sm sm:text-base text-[#06B6D4] font-semibold">
                  makobot.com
                </div>
                <div className="mt-3 text-xs text-[#94A3B8] tracking-wider">
                  BUILD 104 · MAKOBYTES · LOCAL-FIRST
                </div>
              </div>
            </div>
          );
        }

        // Shot scene
        const panClass =
          sc.pan === "tl"
            ? "walk-kb-tl"
            : sc.pan === "tr"
              ? "walk-kb-tr"
              : "walk-kb-bd";
        return (
          <div key={idx} className="absolute inset-0" style={baseOpacity}>
            <div className="absolute inset-0 flex items-center justify-center px-6 pt-12 pb-28">
              <div className="relative w-full h-full max-w-[1200px] flex items-center justify-center overflow-hidden rounded-lg">
                {/* Use plain <img> so we can attach CSS keyframe transforms; Next/Image wraps in extra divs that interfere */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sc.src}
                  alt={sc.alt}
                  className={`max-w-full max-h-full object-contain rounded-md ${isActive ? panClass : ""}`}
                  style={{
                    transformOrigin: "center center",
                    animationDuration: `${dur}ms`,
                  }}
                  loading={idx <= 2 ? "eager" : "lazy"}
                />
              </div>
            </div>
            <div
              className="absolute left-1/2 bottom-4 sm:bottom-6 -translate-x-1/2 w-[92%] max-w-[900px] text-center"
              style={{
                opacity: isActive ? 1 : 0,
                transform: `translateX(-50%) translateY(${isActive ? "0" : "20px"})`,
                transition: "opacity 500ms ease-out 200ms, transform 500ms ease-out 200ms",
              }}
            >
              <div className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white"
                   style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
                {sc.head}
              </div>
              {sc.sub && (
                <div className="mt-2 text-xs sm:text-base text-[#CBD5E1] font-medium"
                     style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                  {sc.sub}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* progress bar */}
      <div
        className="absolute left-0 bottom-0 h-[3px] z-30"
        style={{
          width: `${((offsets[active] ?? 0) / WALK_TOTAL_MS) * 100 + (((WALK_SCENES[active]?.dur ?? 0) / WALK_TOTAL_MS) * 100) * 0}%`,
          background: "linear-gradient(90deg, #06B6D4, #3B82F6)",
          boxShadow: "0 0 12px rgba(59,130,246,0.6)",
          transition: "width 200ms linear",
        }}
      />

      {/* Animation keyframes */}
      <style jsx>{`
        .walk-kb-tl {
          animation-name: walkKbTl;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        .walk-kb-tr {
          animation-name: walkKbTr;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        .walk-kb-bd {
          animation-name: walkKbBd;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        @keyframes walkKbTl {
          0%   { transform: scale(1.0) translate(0, 0); }
          100% { transform: scale(1.06) translate(-1%, -1%); }
        }
        @keyframes walkKbTr {
          0%   { transform: scale(1.0) translate(0, 0); }
          100% { transform: scale(1.06) translate(1%, -1%); }
        }
        @keyframes walkKbBd {
          0%   { transform: scale(1.0) translate(0, 0); }
          100% { transform: scale(1.07) translate(0, 1.5%); }
        }
      `}</style>
    </div>
  );
}
