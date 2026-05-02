"use client";

import { useState, useEffect, useRef, useMemo, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { MAKOBOT_BUILD } from "@/lib/version";

/* ─── BACK TO TOP — small floating blue circle, bottom-right, fades in after scroll ─── */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#0061aa] hover:bg-[#004d88] text-white flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0061aa] ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
}

/* ─── LOGO ─── */
export function Logo({ size = 64 }: { size?: number }) {
  const fontSize = Math.round(size * 0.45);
  return (
    <div
      className="relative rounded-full flex items-center justify-center logo-ring mx-auto"
      style={{
        width: size,
        height: size,
        background: "#ffffff",
        border: `${Math.max(3, Math.round(size * 0.04))}px solid #0061aa`,
      }}
    >
      <span
        className="font-bold select-none"
        style={{ fontSize, lineHeight: 1, color: "#0061aa" }}
      >
        M
      </span>
    </div>
  );
}

/* ─── AI BADGE PILL ─── */
/* color prop is accepted for backward compat but ignored — all chips render in
   the Bulldog-light navy via .badge-pill to keep the palette uniform. */
export function AiBadge({ name }: { name: string; color?: string }) {
  return <span className="badge-pill">{name}</span>;
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
    <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] feature-card">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-[#333333] mb-2">{title}</h3>
      <p className="text-sm text-[#777777] leading-relaxed">{description}</p>
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
    <div className="relative bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
      <div className="w-10 h-10 rounded-full bg-[#0061aa] flex items-center justify-center text-white font-bold text-lg mb-4">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-[#333333] mb-2">{title}</h3>
      <p className="text-sm text-[#777777] leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── STAT CARD ─── */
export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl sm:text-4xl font-bold text-[#0061aa]">{value}</p>
      <p className="text-sm text-[#777777] mt-1">{label}</p>
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
      <h2 className="text-3xl sm:text-4xl font-bold text-[#333333]">
        {title}
      </h2>
      <p className="mt-3 text-lg text-[#777777]">{subtitle}</p>
    </div>
  );
}

/* ─── NAV ─── */
export function Nav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#dbdbdb]/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={36} />
          <span className="text-lg font-bold text-[#333333]">MakoBot</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#how-it-works"
            className="text-sm text-[#777777] hover:text-[#333333] transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#features"
            className="text-sm text-[#777777] hover:text-[#333333] transition-colors"
          >
            Features
          </Link>
          <Link
            href="/compare"
            className="text-sm text-[#777777] hover:text-[#333333] transition-colors"
          >
            Compare
          </Link>
          <Link
            href="/exchange"
            className="relative text-sm font-semibold text-white px-3 py-1 rounded-full bg-[#0072c4] hover:bg-[#0061aa] ring-1 ring-[#0061aa]/30 hover:shadow-lg hover:shadow-[#0061aa]/25 transition-all"
          >
            Skills Exchange
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#10B981] border-2 border-[#ffffff]"></span>
            </span>
          </Link>
          <Link
            href="/#download"
            className="inline-flex items-center px-5 py-2 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-sm font-semibold transition-colors"
          >
            Download
          </Link>
          {session?.user?.isAdmin && (
            <Link
              href="/admin"
              className="text-sm text-[#777777] hover:text-[#333333] transition-colors"
            >
              Admin
            </Link>
          )}
          {session?.user && (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-[#777777] hover:text-[#DC2626] transition-colors"
              title="Sign out"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#777777] hover:text-[#333333] p-2"
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
        <div className="md:hidden bg-[#f8f9fb] border-t border-[#dbdbdb] px-6 py-4 flex flex-col gap-4">
          <Link
            href="/#how-it-works"
            onClick={() => setOpen(false)}
            className="text-sm text-[#555555]"
          >
            How It Works
          </Link>
          <Link
            href="/#features"
            onClick={() => setOpen(false)}
            className="text-sm text-[#555555]"
          >
            Features
          </Link>
          <Link
            href="/compare"
            onClick={() => setOpen(false)}
            className="text-sm text-[#555555]"
          >
            Compare
          </Link>
          <Link
            href="/exchange"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-full bg-[#0072c4] ring-1 ring-[#0061aa]/30 w-fit"
          >
            Skills Exchange
            <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
          </Link>
          <Link
            href="/#download"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-[#0061aa] text-white text-sm font-semibold"
          >
            Download
          </Link>
          {session?.user?.isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="text-sm text-[#777777]"
            >
              Admin
            </Link>
          )}
          {session?.user && (
            <button
              type="button"
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
    <footer className="border-t border-[#dbdbdb]/50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <p className="text-sm font-semibold text-[#333333]">MakoBot</p>
              <p className="text-xs text-[#999999]">by <a href="https://makologics.com" target="_blank" rel="noopener" className="hover:text-[#555555] transition-colors">Mako Logics</a></p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-[#777777] mb-1">
              Part of the{" "}
              <span className="text-[#333333] font-medium">MakoBytes</span>{" "}
              product family
            </p>
            <div className="flex gap-4 text-xs text-[#999999]">
              <a href="https://www.makobytes.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#555555] transition-colors">PromptPixel</a>
              <span>·</span>
              <a href="https://aipromptshive.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#555555] transition-colors">AI Prompt Hive</a>
              <span>·</span>
              <span className="text-[#0061aa]">MakoBot</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#dbdbdb]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#777777]">
            &copy; {new Date().getFullYear()} Mako Logics. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-[#999999]">
            <Link href="/privacy" className="hover:text-[#555555] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#555555] transition-colors">Terms of Service</Link>
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
          <span className="text-[#0061aa]">Memory</span>{" "}·{" "}
          <span className="text-[#0061aa]">AI Tools</span>{" "}·{" "}
          <span className="text-[#0061aa]">Skills</span>
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
          <span className="text-[#0061aa]">@verify</span>{" "}·{" "}
          <span className="text-[#0061aa]">@audit</span>{" "}·{" "}
          <span className="text-[#0061aa]">@codereview</span>{" "}·{" "}
          <span className="text-[#0061aa]">@designreview</span>{" "}·{" "}
          <span className="text-[#0061aa]">@contractreview</span>
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
      className="relative w-full aspect-[16/10] rounded-xl shadow-2xl border border-[#dbdbdb]/50 overflow-hidden bg-[#001321]"
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
             style={{ background: "linear-gradient(135deg, #0061aa, #66a5db)", boxShadow: "0 4px 12px rgba(59,130,246,0.4)" }}>
          M
        </div>
        <span className="text-white font-bold text-sm tracking-wide">
          MakoBot <span className="text-[#777777] font-normal text-xs ml-1">Build {MAKOBOT_BUILD}</span>
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
                  background: "linear-gradient(135deg, #0061aa, #66a5db)",
                  boxShadow: "0 20px 50px rgba(59,130,246,0.5), inset 0 2px 0 rgba(255,255,255,0.2)",
                }}
              >
                M
              </div>
              <div className="mt-6 text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-b from-white to-[#777777] bg-clip-text text-transparent">
                MakoBot
              </div>
              <div className="mt-2 text-sm sm:text-lg text-[#0061aa] font-medium">
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
                <div className="text-2xl sm:text-4xl font-black leading-tight bg-gradient-to-b from-white to-[#999999] bg-clip-text text-transparent">
                  Stop losing<br />your AI work.
                </div>
                <div
                  className={`inline-flex mt-6 px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-lg ${isActive ? "animate-pulse" : ""}`}
                  style={{
                    background: "linear-gradient(135deg, #0061aa, #66a5db)",
                    boxShadow: "0 12px 32px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  Download for Windows · Free
                </div>
                <div className="mt-4 text-sm sm:text-base text-[#0061aa] font-semibold">
                  makobot.com
                </div>
                <div className="mt-3 text-xs text-[#777777] tracking-wider">
                  BUILD {MAKOBOT_BUILD} · MAKOBYTES · LOCAL-FIRST
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
              className="absolute inset-x-0 bottom-4 sm:bottom-6 flex justify-center px-4 sm:px-6 pointer-events-none"
              style={{
                opacity: isActive ? 1 : 0,
                transform: `translateY(${isActive ? "0" : "20px"})`,
                transition: "opacity 500ms ease-out 200ms, transform 500ms ease-out 200ms",
              }}
            >
              <div className="w-full max-w-3xl text-center">
                <div className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white"
                     style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
                  {sc.head}
                </div>
                {sc.sub && (
                  <div className="mt-2 text-xs sm:text-base text-[#999999] font-medium"
                       style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                    {sc.sub}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* progress bar */}
      <div
        className="absolute left-0 bottom-0 h-[3px] z-30"
        style={{
          width: `${((offsets[active] ?? 0) / WALK_TOTAL_MS) * 100 + (((WALK_SCENES[active]?.dur ?? 0) / WALK_TOTAL_MS) * 100) * 0}%`,
          background: "linear-gradient(90deg, #0061aa, #0061aa)",
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
