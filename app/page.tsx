import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://makobot.com" },
};
import {
  Logo,
  AiBadge,
  FeatureCard,
  Glyph,
  StepCard,
  SectionHeading,
  Nav,
  Footer,
} from "./components";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Nav />

      {/* ─── HERO ─── */}
      <section id="hero" className="relative">
        {/* Full-width 16:9 video banner — fits edge-to-edge horizontally, natural aspect ratio (no zoom, no crop). */}
        <div className="w-full aspect-video relative overflow-hidden bg-[#0a1628]">
          {/* poster is the video's own first frame. Without it this box is just
              bg-[#0a1628] — a dark navy rectangle — until 4 MB of MP4 arrives,
              and it stays that way forever if autoplay is blocked (Low Power
              Mode, data saver, reduced-motion, most mobile browsers). The robot
              has to be visible whether or not the video ever plays. */}
          {/* VERSIONED FILENAMES - do not reuse these names when the media changes.
              /videos/* and /images/* are served with
              "Cache-Control: public, max-age=31536000, immutable". immutable means
              a browser that already has the file will NEVER revalidate it - not on
              reload, not on hard refresh. When 281c508 swapped hero.mp4 in place on
              16 Aug, every visitor who had loaded the page kept the old bytes for a
              YEAR, and restoring the file on the server could not reach them,
              because the URL never changed. Bump the -vN suffix on every replacement. */}
          <video
            src="/videos/hero-robot-v2.mp4"
            poster="/images/hero-poster-v2.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Hero text content sits below the video on the page background. */}
        <div className="relative isolate flex flex-col items-center justify-center px-6 pt-16 pb-16">
          {/* Background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#0061aa] opacity-[0.07] blur-[120px] pointer-events-none -z-10" />

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center max-w-4xl leading-tight mb-4">
            Your AI forgets everything.{" "}
            <span className="gradient-text">MakoBot remembers.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#0061aa] text-center font-semibold mb-6 tracking-wide">
            One memory, shared by every AI tool you use.
          </p>

          <p className="text-lg sm:text-xl text-[#555555] text-center max-w-3xl mb-4 leading-relaxed">
            MakoBot runs on your Windows PC and quietly remembers your work —
            every project, every decision, every conversation. When you open{" "}
            <span className="text-[#333333] font-semibold">Claude, Cursor, ChatGPT, or Gemini</span>,
            it briefs them automatically. No more spending the first ten minutes
            of every session re-explaining your own project.
          </p>

          <p className="text-base text-[#777777] text-center max-w-2xl mb-8 leading-relaxed">
            100% on your machine — no cloud, no account, no subscription. It
            makes the AI tools you already pay for remember you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="/get-key"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white font-semibold text-lg transition-colors"
            >
              Get Free Key + Download
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-[#dbdbdb] hover:border-[#777777] text-[#555555] font-medium text-lg transition-colors"
            >
              See Features
            </a>
          </div>

          {/* AI tool badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <AiBadge name="Claude" />
            <AiBadge name="Antigravity" />
            <AiBadge name="Cursor" />
            <AiBadge name="Windsurf" />
            <AiBadge name="Gemini" />
            <AiBadge name="ChatGPT" />
          </div>

          <p className="text-sm text-[#999999]">
            Works with every AI coding tool. Windows 10/11.
          </p>
        </div>
      </section>

      {/* ─── THE PROBLEM ─── */}
      <section className="px-6 py-20 bg-[#eef2f7]">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading
            title="The problem with AI today"
            subtitle="Every AI builder — engineer, founder, freelancer — hits the same walls"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="message" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                &quot;Where did I leave off?&quot;
              </p>
              <p className="text-[#777777] text-sm">
                Every new AI session starts from zero. You spend 10 minutes
                re-explaining your project before any actual work.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="unplug" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                &quot;Session crashed — everything&apos;s gone&quot;
              </p>
              <p className="text-[#777777] text-sm">
                Hours of decisions and progress vanish when a session
                disconnects or hits a context limit.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="shuffle" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                &quot;I use 3 AI tools and none of them talk&quot;
              </p>
              <p className="text-[#777777] text-sm">
                Claude doesn&apos;t know what you told ChatGPT. Cursor
                doesn&apos;t know what Gemini decided. Each tool is an island.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE 2026 OBJECTION: "doesn't Claude already remember?" ───
          Every major assistant shipped native memory in 2025-26. Anyone
          landing here thinks memory is solved — this section is the answer,
          and it's MakoBot's strongest card: vendor memories are per-tool
          silos; MakoBot is the one brain above all of them. */}
      <section id="one-brain" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="&ldquo;Doesn&rsquo;t Claude already have memory?&rdquo;"
            subtitle="It does. So do ChatGPT, Gemini, and Cursor. That's exactly the problem."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] text-center">
              <Glyph name="wall" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                What Claude remembers stays in Claude
              </p>
              <p className="text-[#777777] text-sm leading-relaxed">
                Tell Claude your project&apos;s rules on Tuesday. Open Cursor on
                Wednesday — it has no idea.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] text-center">
              <Glyph name="wall" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                What ChatGPT remembers stays in ChatGPT
              </p>
              <p className="text-[#777777] text-sm leading-relaxed">
                Months of preferences locked inside one vendor&apos;s product —
                stored on their servers, not yours.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] text-center">
              <Glyph name="wall" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                What Cursor remembers stays in Cursor
              </p>
              <p className="text-[#777777] text-sm leading-relaxed">
                Per-project notes that never reach your other tools — and vanish
                the day you switch editors.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-[#ffffff] to-[#f8f9fb] rounded-xl border border-[#0061aa]/40 p-8 text-center">
            <p className="text-xl sm:text-2xl font-bold text-[#333333] mb-3">
              MakoBot is the one memory <span className="text-[#0061aa]">above</span> all of them.
            </p>
            <p className="text-[#0061aa] text-base font-semibold">
              Vendor memories remember you for them. MakoBot remembers for you.
            </p>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="How MakoBot Works"
            subtitle="Three steps, zero configuration"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <StepCard
              step={1}
              title="Install and Add Projects"
              description="Run MakoBot and point it at your project folders. That's it. It starts watching automatically."
            />
            <StepCard
              step={2}
              title="Work Like Normal"
              description="Use any AI tool — Claude, ChatGPT, Cursor, Gemini. MakoBot silently records commits, conversations, and decisions in the background."
            />
            <StepCard
              step={3}
              title="Every Session Knows Everything"
              description="When you start a new AI session, MakoBot has already written the context. The AI knows your projects, your preferences, and where you left off."
            />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───
          Deliberately eight cards, not twenty-eight. The full list is what the
          app's own Guide tab is for; a landing page that lists every feature
          gets read as none of them. */}
      <section id="features" className="px-6 py-20 bg-[#eef2f7]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="What's in MakoBot"
            subtitle="The eight that matter most"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <FeatureCard
              icon="network"
              title="One Brain, Every AI Tool"
              description="MakoBot finds Cursor, Gemini CLI, and Windsurf on your machine and connects each to its local memory server automatically. Every AI tool you use shares the same memory, search, and project context."
            />
            <FeatureCard
              icon="inject"
              title="Auto-Injection"
              description="MakoBot writes context directly into CLAUDE.md, AGENTS.md, and .cursorrules. Zero-friction for Claude Code, Antigravity, Cursor, and Windsurf. For web tools, one click copies your context and opens the browser."
            />
            <FeatureCard
              icon="globe"
              title="Live Web-AI Capture"
              description="A browser extension saves your ChatGPT, Claude.ai, and Gemini conversations into your memory as you chat — verbatim, local, seconds after each reply. The only way to keep Gemini's replies; Google's own export leaves them out."
            />
            <FeatureCard
              icon="bot"
              title="Autopilot — No Babysitting"
              description="MakoBot decides which memories and skills are worth keeping — good ones saved, junk discarded, stale ones archived (filed, never destroyed, always undoable). No approval queue; every decision shows in a plain-English activity feed."
            />
            <FeatureCard
              icon="bot"
              title="AI Tools (Plug-ins)"
              description="@verify, @audit, @codereview, @designreview, @contractreview — type the trigger in your AI chat and MakoBot fans the question out to GPT, Claude, and Gemini in parallel for a second opinion. BYOK, DPAPI-encrypted."
            />
            <FeatureCard
              icon="laptop"
              title="MakoSync — Every Computer"
              description="Your brain on every machine you own — no server, no account. AES-256-encrypted change packets through a folder you already sync. Only you hold the passphrase, and merging can only ever ADD, so a new laptop can never wipe your desktop."
            />
            <FeatureCard
              icon="cpu"
              title="Local Model (No Cloud)"
              description="A bundled local model runs entirely on your machine. Zero cloud calls, zero API keys, works offline. One-click CUDA add-on unlocks full NVIDIA speed, and auto-detect sets GPU layers and context size for you."
            />
            <FeatureCard
              icon="lock"
              title="100% Private"
              description="Everything stays on your computer. No cloud, no accounts, no telemetry. Even MakoSync only moves encrypted blobs through storage YOU control — your data never leaves your machine readable."
            />
          </div>
        </div>
      </section>

      {/* ─── AI TOOL COMPATIBILITY ─── */}
      <section id="compatibility" className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="Compatible with Claude Code, Cursor, ChatGPT & More"
            subtitle="Automatic injection for local tools, one-click clipboard for web tools"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Fully Automatic */}
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse-dot" />
                <h3 className="text-lg font-semibold text-[#333333]">
                  Fully Automatic
                </h3>
              </div>
              <p className="text-sm text-[#777777] mb-4">
                MakoBot writes context directly into their config files. No
                manual steps.
              </p>
              <div className="flex flex-col gap-2">
                <AiBadge name="Claude Code" />
                <AiBadge name="Antigravity" />
                <AiBadge name="Cursor" />
                <AiBadge name="Windsurf" />
              </div>
            </div>

            {/* One-Click */}
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <div className="flex items-center gap-2 mb-4">
                <Glyph name="zap" className="w-5 h-5 text-[#0061aa]" />
                <h3 className="text-lg font-semibold text-[#333333]">
                  One Click
                </h3>
              </div>
              <p className="text-sm text-[#777777] mb-4">
                Click the button in MakoBot&apos;s widget. It copies context and
                opens the browser.
              </p>
              <div className="flex flex-col gap-2">
                <AiBadge name="ChatGPT" />
                <AiBadge name="Claude Web" />
                <AiBadge name="Google Gemini" />
              </div>
            </div>

            {/* Any Tool */}
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <div className="flex items-center gap-2 mb-4">
                <Glyph name="clipboard" className="w-5 h-5 text-[#777777]" />
                <h3 className="text-lg font-semibold text-[#333333]">
                  Any Tool
                </h3>
              </div>
              <p className="text-sm text-[#777777] mb-4">
                Copy context to clipboard and paste into any AI tool. Import
                conversations back with one click.
              </p>
              <div className="text-sm text-[#555555]">
                <p>Copy Context → paste anywhere</p>
                <p>Import Clipboard → save conversations back</p>
                <p className="mt-2 text-[#777777]">
                  Works with literally any AI tool
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BEFORE / AFTER ─── */}
      <section id="before-after" className="px-6 py-20 bg-[#eef2f7]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Before vs. after"
            subtitle="A real fresh-chat workflow, side by side."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {/* BEFORE */}
            <div className="bg-[#ffffff] rounded-xl border border-[#dbdbdb] p-6">
              <div className="text-xs font-bold text-[#DC2626] mb-3 tracking-wide">BEFORE MAKOBOT</div>
              <ol className="space-y-3 text-sm text-[#555555] leading-relaxed">
                <li><span className="text-[#DC2626] font-mono mr-2">10:00</span> Open Claude Code, start a new chat — no memory of yesterday</li>
                <li><span className="text-[#DC2626] font-mono mr-2">10:02</span> Type six paragraphs explaining the project and what was decided last week</li>
                <li><span className="text-[#DC2626] font-mono mr-2">10:08</span> Realize you forgot the database schema. Paste it in.</li>
                <li><span className="text-[#DC2626] font-mono mr-2">10:10</span> Dig through old chats for Tuesday&apos;s deploy issue. Copy-paste.</li>
                <li><span className="text-[#DC2626] font-mono mr-2">10:14</span> Finally start working</li>
              </ol>
              <p className="mt-5 text-sm text-[#777777] italic">14 minutes burned before any actual work. Five times a day = ~1 hour gone.</p>
            </div>

            {/* AFTER */}
            <div className="bg-gradient-to-br from-[#ffffff] to-[#f8f9fb] rounded-xl border border-[#0061aa]/40 p-6">
              <div className="text-xs font-bold text-[#10B981] mb-3 tracking-wide">WITH MAKOBOT</div>
              <ol className="space-y-3 text-sm text-[#555555] leading-relaxed">
                <li><span className="text-[#10B981] font-mono mr-2">10:00</span> Open Claude Code</li>
                <li><span className="text-[#10B981] font-mono mr-2">10:00</span> Type <code className="bg-[#e6f0f9] px-2 py-0.5 rounded text-[#0061aa]">Recover</code></li>
                <li><span className="text-[#10B981] font-mono mr-2">10:00</span> Claude reads MakoBot&apos;s injected context — your projects, recent commits, last session, open decisions</li>
                <li><span className="text-[#10B981] font-mono mr-2">10:00</span> Start working</li>
              </ol>
              <div className="mt-4 bg-[#eef2f7] rounded-lg p-4 text-left">
                <p className="text-xs text-[#777777] font-semibold mb-1 tracking-wide">THE AI&apos;S FIRST REPLY LOOKS LIKE:</p>
                <p className="text-sm text-[#555555] italic leading-relaxed">
                  &ldquo;Recovered. You shipped last night&rsquo;s audit-fix build —
                  every fix is live. The client site redesign went out Wednesday;
                  its contact form fix is still open. Want to pick that up?&rdquo;
                </p>
              </div>
              <p className="mt-4 text-sm text-[#0061aa] italic">Under 30 seconds. ~1 hour back per day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DOWNLOAD CTA ─── */}
      <section id="download" className="px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Logo size={80} />
          <h2 className="text-3xl sm:text-4xl font-bold mt-8 mb-4">
            Ready to set up your AI Workbench?
          </h2>
          <p className="text-lg text-[#555555] mb-8 max-w-xl mx-auto">
            Download MakoBot, add your project folders, and never re-explain your
            work to an AI again. Free. Private. No account needed.
          </p>

          <a
            href="/get-key"
            className="inline-flex items-center justify-center px-10 py-5 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white font-semibold text-xl transition-colors blue-glow"
          >
            Get Free Key + Download
          </a>

          <p className="mt-4 text-sm text-[#999999]">
            Windows 10/11 · ~66 MB installer download · Digitally signed by Mako Logics LLC
          </p>
          <p className="mt-2 text-xs text-[#777777]">
            Verified by Microsoft Azure Trusted Signing — no SmartScreen warnings
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <AiBadge name="Claude" />
            <AiBadge name="Antigravity" />
            <AiBadge name="Cursor" />
            <AiBadge name="Windsurf" />
            <AiBadge name="Gemini" />
            <AiBadge name="ChatGPT" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
