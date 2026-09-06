"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Globe, Bot, Brain, Laptop, Activity, Network, Users, Moon, ListTree, Store,
  Cpu, Smartphone, KeyRound, Sunrise, Save, FolderGit2, FileDown, ClipboardCopy,
  CircleDot, LayoutDashboard, ScanText, Mic, Wrench, Settings, ShieldCheck, Lock,
  Rocket, Briefcase, Building2, Scale, MessageSquare, Unplug, Shuffle, BrickWall,
  Wand2, Sparkles, Zap, type LucideIcon,
} from "lucide-react";

/* ─── ICON SYSTEM (2026-07-23) ───
   Replaced the emoji icons across the site with a single consistent Lucide
   SVG set, all tinted in the brand navy — so the icons read as one system
   instead of OS-dependent emoji. Keyed by short semantic names. */
const GLYPHS: Record<string, LucideIcon> = {
  globe: Globe, bot: Bot, brain: Brain, laptop: Laptop, activity: Activity,
  network: Network, agents: Users, moon: Moon, list: ListTree, store: Store,
  cpu: Cpu, phone: Smartphone, key: KeyRound, sunrise: Sunrise, save: Save,
  folder: FolderGit2, inject: FileDown, clipboard: ClipboardCopy, widget: CircleDot,
  dashboard: LayoutDashboard, scan: ScanText, mic: Mic, wrench: Wrench,
  settings: Settings, shield: ShieldCheck, lock: Lock, rocket: Rocket,
  briefcase: Briefcase, building: Building2, scale: Scale, message: MessageSquare,
  unplug: Unplug, shuffle: Shuffle, wall: BrickWall, wand: Wand2, zap: Zap,
};

export function Glyph({ name, className = "w-7 h-7 text-[#0061aa]" }: { name: string; className?: string }) {
  const I = GLYPHS[name] ?? Sparkles;
  return <I className={className} strokeWidth={1.75} aria-hidden="true" />;
}

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
      <Glyph name={icon} className="w-7 h-7 text-[#0061aa] mb-3" />
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
