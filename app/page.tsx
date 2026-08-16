import Link from "next/link";
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
  StatCard,
  SectionHeading,
  Nav,
  Footer,
  Walkthrough,
} from "./components";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Nav />

      {/* ─── HERO ─── */}
      <section id="hero" className="relative">
        {/* Full-width 16:9 video banner — fits edge-to-edge horizontally, natural aspect ratio (no zoom, no crop). */}
        <div className="w-full aspect-video relative overflow-hidden bg-[#0a1628]">
          <video
            src="/videos/hero.mp4"
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

          {/* August 2026: MakoBot stopped being a memory layer and became an
              assistant. The old hero sold one idea — shared memory — which is
              still true and still the moat, but it described about a tenth of
              what a visitor now downloads. Russell's words: "most people have
              no idea how it can help them." So the hero leads with what she
              DOES, and memory is the reason she can do it. */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center max-w-4xl leading-tight mb-4">
            An assistant that actually{" "}
            <span className="gradient-text">knows your work.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#0061aa] text-center font-semibold mb-6 tracking-wide">
            She remembers everything, works while you&rsquo;re away, and runs on your own PC.
          </p>

          <p className="text-lg sm:text-xl text-[#555555] text-center max-w-3xl mb-4 leading-relaxed">
            Ask MakoBot for anything and she gets on with it. She{" "}
            <span className="text-[#333333] font-semibold">reads your inbox</span> and tells
            you what actually needs you, keeps up with your projects, handles your
            to-do list and calendar, makes pictures and video, and can look at your
            screen when something breaks.
          </p>

          <p className="text-lg sm:text-xl text-[#555555] text-center max-w-3xl mb-4 leading-relaxed">
            And she never forgets. Every decision and conversation is written down and
            kept <span className="text-[#333333] font-semibold">on your machine</span> — so
            you stop re-explaining your own work, to her or to any other AI tool you use.
          </p>

          <p className="text-base text-[#777777] text-center max-w-2xl mb-8 leading-relaxed">
            Free. Runs on the Claude subscription you already have. Nothing she reads
            leaves your computer, and she never sends an email without showing it to
            you first.
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

        {/* Walkthrough sits BELOW the video block on plain background — video does not extend here. */}
        <div className="px-6 pt-8 pb-24 w-full max-w-4xl mx-auto">
          <Walkthrough />
        </div>
      </section>

      {/* ─── THE PROBLEM ─── */}
      <section className="px-6 py-20 bg-[#eef2f7]">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading
            title="Why another AI app?"
            subtitle="Because the ones you have forget you every morning, and none of them can do anything while you are asleep"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="message" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                &quot;Where did I leave off?&quot;
              </p>
              <p className="text-[#777777] text-sm">
                Every new AI session starts from zero. You spend 10 minutes
                re-explaining your project before you can do any actual work.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="unplug" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                &quot;Session crashed — everything&apos;s gone&quot;
              </p>
              <p className="text-[#777777] text-sm">
                Hours of decisions, progress, and context vanish when a session
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

          <p className="mt-10 text-xl text-[#0061aa] font-semibold">
            MakoBot fixes all of this — and adds the second opinion you&apos;ve been wishing for.
          </p>
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
                Months of preferences and context, locked inside one vendor&apos;s
                product — and stored on their servers, not yours.
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
            <p className="text-[#555555] text-base max-w-3xl mx-auto leading-relaxed mb-3">
              It watches your actual work — commits, conversations, decisions,
              notes — keeps the full history on <span className="font-semibold text-[#333333]">your</span> machine,
              and briefs every AI tool from the same brain. Switch from Claude to
              Cursor to Gemini mid-project and nothing is lost. Switch to next
              year&apos;s hot new AI tool and your memory comes with you.
            </p>
            <p className="text-[#0061aa] text-base font-semibold">
              Vendor memories remember you for them. MakoBot remembers for you.
            </p>
          </div>

          {/* Live web capture — the mechanism that actually breaks the silo.
              Added 2026-07-23 (Builds 305-315): the strongest new download
              reason, and the only full-fidelity path for Gemini. */}
          <div className="mt-6 bg-[#f8f9fb] rounded-xl border border-[#dbdbdb] p-8">
            <div className="flex items-start gap-4">
              <Glyph name="globe" className="w-8 h-8 text-[#0061aa] shrink-0" />
              <div>
                <p className="text-lg sm:text-xl font-bold text-[#333333] mb-2">
                  New: it captures your web AI chats as you have them.
                </p>
                <p className="text-[#555555] text-base leading-relaxed mb-3">
                  A small browser extension saves your{" "}
                  <span className="font-semibold text-[#333333]">ChatGPT, Claude.ai, and Gemini</span>{" "}
                  conversations straight into your memory — the full conversation,
                  verbatim, on your own machine, a few seconds after each reply.
                  No exporting, no copy-paste. It only ever <em>adds</em> to your
                  history; it can never read your memory or send anything anywhere.
                </p>
                <p className="text-[#0061aa] text-base font-semibold">
                  It&rsquo;s also the only way to keep Gemini&rsquo;s replies —
                  Google&rsquo;s own export leaves them out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FIVE PILLARS — moved up so the workbench promise is explained early ─── */}
      <section id="pillars" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="What she can actually do"
            subtitle="Not a chat box. An assistant with a memory, a set of specialists, and the run of your own machine."
          />

          {/* Rewritten 2026-08-16 against the shipping app. The previous five
              cards described the WPF product and two claims had gone false:
              the Skills Marketplace was cut, and "Smart Search finds any of it
              by meaning" was never true of the shipping build — src/search.js
              is lexical and says so in its own header. A claim on a public page
              that the code contradicts is the one thing that must never ship. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="brain" className="w-8 h-8 text-[#0061aa] mb-3" />
              <h3 className="text-base font-semibold text-[#333333] mb-2">She remembers</h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                Every conversation, decision and project note is written down and kept
                in a folder on your disk you can open and read. Ask what you decided
                about a client six months ago and she looks it up instead of guessing.
                Your other AI tools can read the same memory, so you are not
                re-explaining yourself to each one.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="agents" className="w-8 h-8 text-[#0061aa] mb-3" />
              <h3 className="text-base font-semibold text-[#333333] mb-2">Eleven specialists</h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                You talk to MakoBot; she brings in whoever the job needs — a researcher,
                a coder, a reviewer, an archivist. Each keeps its own thread, and they
                hand work to each other. <span className="text-[#0061aa] font-semibold">Dreams</span>{" "}
                looks back over quiet periods and writes down what was worth keeping.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="wand" className="w-8 h-8 text-[#0061aa] mb-3" />
              <h3 className="text-base font-semibold text-[#333333] mb-2">Your inbox and your day</h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                She reads your email, tells you what genuinely needs an answer, and
                drafts replies in your voice.{" "}
                <span className="text-[#0061aa] font-semibold">She never sends one without showing you first</span>{" "}
                — that is not a setting you can switch off. Your to-do list and calendar
                are hers to read and add to as well.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="wrench" className="w-8 h-8 text-[#0061aa] mb-3" />
              <h3 className="text-base font-semibold text-[#333333] mb-2">New abilities</h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                A shelf of extras you can switch on: a real web browser, a folder on
                your PC, GitHub, a database, Slack, web search. Each one says exactly
                what it runs and what it can reach before you agree.{" "}
                <span className="text-[#0061aa] font-semibold">You</span> install them —
                she can only ask, and the ask appears where you will see it.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="bot" className="w-8 h-8 text-[#0061aa] mb-3" />
              <h3 className="text-base font-semibold text-[#333333] mb-2">She looks after herself</h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                She checks that everything she does still works and says so when it does
                not, rather than failing quietly. Her memory is backed up automatically,
                can be locked with a passphrase, and syncs between your computers. She
                is also on your phone, over your own private network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SEARCH (the feature users love most) ─── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="Search across every project, every AI tool, every conversation"
            subtitle="The feature users tell us they love most"
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3">
              <p className="text-[#555555] text-base leading-relaxed mb-4">
                You remember Claude solved this exact bug for you a few weeks
                ago — but on a different project. Without MakoBot, you re-derive
                the answer (10–30 minutes).{" "}
                <span className="text-[#333333] font-semibold">
                  With MakoBot, you type one word and find the conversation in
                  five seconds.
                </span>
              </p>
              <p className="text-[#555555] text-base leading-relaxed mb-4">
                Search reaches every commit, every note, every transcript, every
                skill, and every clipboard import — across every project and
                every AI tool you use.
              </p>
              <p className="text-[#555555] text-base leading-relaxed mb-4">
                Results are ranked, not just matched: a line carrying all your words
                beats one carrying a common word, an exact phrase beats scattered
                words, and recent work edges out old work when scores tie. It needs no
                model download and no waiting — it searches the moment you install.
                It runs entirely on your machine. Nothing
                leaves your computer.
              </p>
              <a
                href="#time-saved"
                className="inline-flex items-center text-sm text-[#0061aa] hover:text-[#004d88] font-semibold"
              >
                See the time-saved math →
              </a>
            </div>
            <div className="md:col-span-2 bg-[#ffffff] rounded-xl border border-[#dbdbdb] p-5">
              <p className="text-xs text-[#777777] mb-3 font-semibold tracking-wide">REAL SEARCHES USERS RUN</p>
              <ul className="space-y-2 text-sm font-mono">
                <li><span className="text-[#0061aa]">webhook</span> <span className="text-[#777777] font-sans not-italic ml-2">which client?</span></li>
                <li><span className="text-[#0061aa]">deploy fix</span> <span className="text-[#777777] font-sans not-italic ml-2">what command?</span></li>
                <li><span className="text-[#0061aa]">stripe</span> <span className="text-[#777777] font-sans not-italic ml-2">that integration</span></li>
                <li><span className="text-[#0061aa]">404</span> <span className="text-[#777777] font-sans not-italic ml-2">which project?</span></li>
                <li><span className="text-[#0061aa]">race condition</span> <span className="text-[#777777] font-sans not-italic ml-2">last month&apos;s fix</span></li>
                <li><span className="text-[#0061aa]">CONTACT_EMAIL_TO</span> <span className="text-[#777777] font-sans not-italic ml-2">that env var, ranked by how well it matches</span></li>
              </ul>
            </div>
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

      {/* ─── FEATURES ─── */}
      <section id="features" className="px-6 py-20 bg-[#eef2f7]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="What's in MakoBot"
            subtitle="Everything below ships in the free download — no tiers, no add-ons"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <FeatureCard
              icon="globe"
              title="Live Web-AI Capture"
              description="A browser extension saves your ChatGPT, Claude.ai, and Gemini conversations into your memory as you chat — verbatim, local, a few seconds after each reply. No exporting. It can only add transcripts, never read your memory. The only way to keep Gemini's replies (Google's own export leaves them out)."
            />
            <FeatureCard
              icon="bot"
              title="Autopilot — No Babysitting"
              description="MakoBot decides which memories and skills are worth keeping — good ones saved, junk discarded, stale ones archived (filed, never destroyed, always undoable). The old approve/reject queue is gone; every decision shows in a plain-English activity feed. Two toggles (memory + skills) if you'd rather review it yourself."
            />
            <FeatureCard
              icon="brain"
              title="Search Everything"
              description="One search across every commit, note, transcript and skill, in every project. Scored rather than just matched: all your words beats one of them, an exact phrase beats scattered words, and recent work wins a tie. No model to download and no index to wait for — it works the moment you install, entirely on your machine."
            />
            <FeatureCard
              icon="laptop"
              title="MakoSync — Every Computer"
              description="Your brain on every machine you own — no server, no account. Each computer writes small AES-256-encrypted change packets into a folder you already sync (OneDrive built in; Dropbox, Google Drive, NAS all work). Only you hold the passphrase. Merging can only ever ADD — a fresh laptop can never wipe your desktop's memory."
            />
            <FeatureCard
              icon="activity"
              title="Memory Health"
              description="A dashboard tile that watches the watchers. Files shrinking (data loss), writers gone silent, corruption, runaway growth — caught within 10 minutes and explained in plain English. 'Your memory is safe,' made visible."
            />
            <FeatureCard
              icon="network"
              title="One Brain, Every AI Tool"
              description="MakoBot finds Cursor, Gemini CLI, and Windsurf on your machine and connects each to its local memory server automatically — Claude Code was always connected. Every AI tool you use shares the same memory, search, and project context."
            />
            <FeatureCard
              icon="bot"
              title="AI Tools (Plug-ins)"
              description="@verify, @audit, @codereview, @designreview, @contractreview — type the trigger in your AI chat and MakoBot fans the question out to GPT, Claude, and Gemini in parallel. BYOK. DPAPI-encrypted."
            />
            <FeatureCard
              icon="agents"
              title="Five Built-in Agents"
              description="Researcher · Builder · Reviewer · Triage · Archivist — each with assignable tasks, inter-agent handoffs, recurring schedules, attachments, web fetch, and live cost tracking. Pick the right one for the job; chain them when you need to."
            />
            <FeatureCard
              icon="moon"
              title="Dreams — Idle-Time Agent"
              description="While you're away, Dreams examines your memory and drafts new skills, feedback rules, and cleanup suggestions. Each shows up in the Tick Log with an AI take attached — and Autopilot can act on the confident ones for you."
            />
            <FeatureCard
              icon="list"
              title="Memory Browser"
              description="Every entry in your memory tree — commits, feedback, skills, notes, sessions, and Dreams — in one fast, readable list. Click any entry to see its full body; source-filter chips and search narrow it instantly, and stick across restarts."
            />
            <FeatureCard
              icon="store"
              title="Connectors"
              description="A curated shelf of extras you can switch on: a real web browser, a folder on your PC, GitHub, a Postgres database, Slack, web search. Each says exactly what it runs and what it can reach before you agree, and installing one starts it for real and only keeps it if it answers. You install them — MakoBot can only ask."
            />
            <FeatureCard
              icon="laptop"
              title="Chat + Code Tabs"
              description="A full Chat tab with a 10+ provider AI picker (Anthropic, OpenAI, Google, Groq, DeepSeek, xAI Grok) plus image vision across providers, and a Code tab with AvalonEdit, embedded terminal, Git pane, file tree, and multi-file tabs. Type your next message while the current one is still streaming — it queues. Sessions resume across app restarts via --session-id / --resume."
            />
            <FeatureCard
              icon="cpu"
              title="Local Model (No Cloud)"
              description="Bundled LlamaSharp local model runs entirely on your machine. Zero cloud calls, zero API keys, works offline. One-click CUDA add-on unlocks full NVIDIA speed, and the 🎯 auto-detect button sets GPU layers + context size from your model — no guessing. Reasoning models get a collapsible 'Thought for…' panel; downloads resume after network hiccups and every curated model is SHA-256-verified."
            />
            <FeatureCard
              icon="phone"
              title="Signal Bridge"
              description="Talk to MakoBot from your phone via the Signal messenger. Ask questions, dispatch agents, search your memory remotely — without opening your laptop."
            />
            <FeatureCard
              icon="key"
              title="Claude Code Max Sign-in"
              description="Sign in with your Claude Max subscription and chat without a separate API key. Every Anthropic call — chat, agents, Dreams, plug-ins — routes through your CLI for free. Cost dashboard merges Max + BYOK in one view."
            />
            <FeatureCard
              icon="brain"
              title="Central Brain + Memory Graph"
              description="One brain.md across all your projects, plus a Memory Graph layer that indexes the auto-memory tree. Every AI tool reads the same source of truth. Non-destructive compaction with quarterly archives keeps it small without losing history."
            />
            <FeatureCard
              icon="sunrise"
              title="Morning Brief"
              description="Open MakoBot and Home leads with 'While you were away' — what Autopilot saved, archived, and let go, what's held for you, new projects found, and where commits landed since you last looked. The whole app's state in one plain-English line."
            />
            <FeatureCard
              icon="save"
              title="Scheduled Auto-Backup"
              description="Set-and-forget backup of your memory tree to OneDrive or any folder on a schedule you pick. Backups stay small (~150 MB) by excluding re-downloadable models, and restore validates the archive and snapshots your current memory before touching anything."
            />
            <FeatureCard
              icon="folder"
              title="Project Watching"
              description="Add folders, MakoBot watches them. Git commits are captured automatically with diff summaries. Pause or remove projects any time."
            />
            <FeatureCard
              icon="inject"
              title="Auto-Injection"
              description="MakoBot writes context directly into CLAUDE.md, AGENTS.md, and .cursorrules. Zero-friction for Claude Code, Antigravity, Cursor, and Windsurf."
            />
            <FeatureCard
              icon="clipboard"
              title="One-Click Clipboard"
              description="For ChatGPT, Gemini, or any web AI — one click copies your project context and opens the browser. Paste and go."
            />
            <FeatureCard
              icon="widget"
              title="Floating Widget"
              description="A small draggable circle on your desktop. Hover to see project cards with instant Copy, ChatGPT, Claude, Gemini, and Cursor buttons."
            />
            <FeatureCard
              icon="dashboard"
              title="Live Dashboard"
              description="Activity feed, storage breakdown, Memory Health tile, context budget meter, project management, settings — all in one clean dark interface."
            />
            <FeatureCard
              icon="scan"
              title="Screen Capture + OCR"
              description="Global hotkey to capture any screen region across all monitors. Built-in OCR extracts the text. Save as a note or import to brain."
            />
            <FeatureCard
              icon="mic"
              title="Voice-to-Text Notes"
              description="Click the mic button, speak your note, and it's saved to your brain. Uses Windows Speech Recognition — no cloud, no API key."
            />
            <FeatureCard
              icon="wrench"
              title="Skills v2 + Reflector"
              description="Slim skill index with on-demand loading (agentskills.io spec), per-client filtering, and a background reflector that proposes new skills + rules after every turn — gated by your approval before anything writes."
            />
            <FeatureCard
              icon="network"
              title="MCP Server"
              description="Built-in MCP server on localhost:7777, auto-registered with Cursor, Gemini CLI, and Windsurf. Any MCP-compatible tool can search your memory, read your brain, add notes — programmatically."
            />
            <FeatureCard
              icon="settings"
              title="Preferences Sync"
              description="Write your working preferences once. MakoBot pushes them to Claude, Antigravity, Cursor, and Windsurf config files simultaneously."
            />
            <FeatureCard
              icon="shield"
              title="Built to Never Lose Your Work"
              description="MakoBot never takes itself down — three layers of crash protection catch errors, show a recovery message, and keep running. A ~70-finding deep audit (security, data integrity, performance, accessibility — full keyboard access, readable 12px+ text, per-monitor DPI) was fixed in a single release."
            />
            <FeatureCard
              icon="lock"
              title="100% Private"
              description="Everything stays on your computer. No cloud, no accounts, no telemetry. Even MakoSync only ever moves encrypted blobs through storage YOU control — your data never leaves your machine readable."
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

      {/* ─── STATS ─── */}
      <section className="px-6 py-16 bg-[#eef2f7]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard value="10+" label="Cloud providers + local model" />
            <StatCard value="5" label="Built-in agents + Dreams" />
            <StatCard value="5" label="Plug-ins: verify · audit · review · design · contract" />
            <StatCard value="∞" label="Sessions remembered" />
          </div>
          <div className="flex items-center justify-center gap-3 mt-8 px-5 py-3 rounded-xl bg-[#ffffff] border border-[#dbdbdb]/50 max-w-lg mx-auto">
            <svg className="w-5 h-5 text-[#10B981] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span className="text-sm text-[#555555]">Digitally signed by <span className="text-[#333333] font-semibold">Mako Logics LLC</span> — verified by Microsoft Azure Trusted Signing</span>
          </div>
        </div>
      </section>

      {/* ─── BEFORE / AFTER (folded in from /why) ─── */}
      <section id="before-after" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Before vs. after"
            subtitle="A real fresh-chat workflow, side by side."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {/* BEFORE */}
            <div className="bg-[#ffffff] rounded-xl border border-[#dbdbdb] p-6">
              <div className="text-xs font-bold text-[#DC2626] mb-3 tracking-wide">BEFORE MAKOBOT</div>
              <h3 className="text-lg font-semibold text-[#333333] mb-4">
                Starting a fresh Claude Code chat
              </h3>
              <ol className="space-y-3 text-sm text-[#555555] leading-relaxed">
                <li><span className="text-[#DC2626] font-mono mr-2">10:00</span> Open Claude Code in VS Code</li>
                <li><span className="text-[#DC2626] font-mono mr-2">10:01</span> Start a new chat — Claude has no memory of yesterday</li>
                <li><span className="text-[#DC2626] font-mono mr-2">10:02</span> Type 6 paragraphs explaining the project, what you&apos;re working on, what was decided last week, what tools you use</li>
                <li><span className="text-[#DC2626] font-mono mr-2">10:08</span> Realize you forgot to mention the database schema. Paste it in.</li>
                <li><span className="text-[#DC2626] font-mono mr-2">10:10</span> Realize Claude needs to know about the deploy issue from Tuesday. Search your old chats. Copy-paste.</li>
                <li><span className="text-[#DC2626] font-mono mr-2">10:14</span> Finally start working</li>
              </ol>
              <p className="mt-5 text-sm text-[#777777] italic">14 minutes burned before any actual work happens. Five times a day = ~1 hour gone.</p>
            </div>

            {/* AFTER */}
            <div className="bg-gradient-to-br from-[#ffffff] to-[#f8f9fb] rounded-xl border border-[#0061aa]/40 p-6">
              <div className="text-xs font-bold text-[#10B981] mb-3 tracking-wide">WITH MAKOBOT</div>
              <h3 className="text-lg font-semibold text-[#333333] mb-4">
                Starting a fresh Claude Code chat
              </h3>
              <ol className="space-y-3 text-sm text-[#555555] leading-relaxed">
                <li><span className="text-[#10B981] font-mono mr-2">10:00</span> Open Claude Code in VS Code</li>
                <li><span className="text-[#10B981] font-mono mr-2">10:00</span> Type <code className="bg-[#e6f0f9] px-2 py-0.5 rounded text-[#0061aa]">Recover</code></li>
                <li><span className="text-[#10B981] font-mono mr-2">10:00</span> Claude reads MakoBot&apos;s injected context — already knows your projects, recent commits, last session, current build, open decisions</li>
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

      {/* ─── TIME-SAVED MATH (folded in from /why) ─── */}
      <section id="time-saved" className="px-6 py-20 bg-[#eef2f7]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="The actual math on time saved"
            subtitle="Conservative numbers from active users."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] text-center">
              <p className="text-4xl font-bold text-[#0061aa] mb-2">~10 min</p>
              <p className="text-sm text-[#555555] leading-relaxed">
                saved per fresh AI chat by skipping the &quot;re-explain the
                project&quot; ritual
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] text-center">
              <p className="text-4xl font-bold text-[#0061aa] mb-2">~15 min</p>
              <p className="text-sm text-[#555555] leading-relaxed">
                saved per &quot;I know I solved this before&quot; moment via search
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] text-center">
              <p className="text-4xl font-bold text-[#0061aa] mb-2">~5 hrs</p>
              <p className="text-sm text-[#555555] leading-relaxed">
                saved per week for an active builder using AI 4–8 hours/day
              </p>
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-[#777777] max-w-2xl mx-auto leading-relaxed">
            Your mileage depends on how often you start fresh AI chats and how
            much you context-switch between projects.
          </p>
        </div>
      </section>

      {/* ─── WHO IT'S FOR (folded in from /why) ─── */}
      <section id="who-its-for" className="px-6 py-20 bg-[#eef2f7]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Who actually needs this"
            subtitle="Most AI productivity tools are made by engineers, for engineers. MakoBot isn't."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <FeatureCard
              icon="rocket"
              title="Solo founders + non-developer builders"
              description="You're running a real business on top of AI tools. You can't hire engineers, but you CAN direct AI. Your bottleneck isn't the AI — it's losing context every time you open a fresh chat."
            />
            <FeatureCard
              icon="briefcase"
              title="Freelancers + small agencies"
              description="Five to ten client projects. You context-switch every day. Without cross-project memory you re-onboard yourself into every chat. Search across every client's history is the killer feature for you."
            />
            <FeatureCard
              icon="building"
              title="MSPs + IT consultants"
              description="Every job is different. Memory + Skills + Commands turn AI into an actual member of your team that remembers every client's stack, every quirk, every decision."
            />
            <FeatureCard
              icon="scale"
              title="Compliance-conscious builders"
              description="Lawyers, healthcare, finance — you want AI productivity but can't paste sensitive data into ChatGPT. BYOK + 100% local + DPAPI-encrypted keys + Verify Mode for second opinions on AI output."
            />
          </div>
        </div>
      </section>

      {/* ─── STORY (folded in from /why) ─── */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#f8f9fb] to-[#ffffff] rounded-xl border border-[#0061aa]/30 p-6 sm:p-10">
            <div className="text-xs font-bold text-[#0061aa] mb-3 tracking-wide">THE STORY</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-5 leading-tight">
              Built by a developer who embraced AI
            </h2>
            <p className="text-[#555555] text-base leading-relaxed mb-4">
              Most AI tools are made by engineers who never left the terminal.
              They assume you know how to install an MCP server, configure
              CLAUDE.md by hand, manage API keys, set up a JSON-RPC bearer
              token, and write your own memory adapters.
            </p>
            <p className="text-[#555555] text-base leading-relaxed mb-4">
              MakoBot is built by a developer who changed career paths,
              embraced AI as a force multiplier, and watched it open doors
              he never expected. He runs a real business that ships real
              client work on top of AI tools — and wanted a workbench built
              for builders like him.
            </p>
            <p className="text-[#333333] text-base leading-relaxed font-medium">
              That&apos;s why MakoBot is a real Windows app with an installer,
              a license key, an in-app updater, big readable UI, and a search
              bar — not a CLI you have to spend a weekend wiring up before
              you can use it.
            </p>
          </div>
        </div>
      </section>

      {/* ─── WHAT'S INSIDE ─── */}
      <section className="px-6 py-20 bg-[#eef2f7]">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="What's Inside the Dashboard"
            subtitle="Every workspace you need in one window"
          />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-12">
            {[
              { name: "Chat", desc: "10+ providers + vision" },
              { name: "Code", desc: "Editor + terminal + Git" },
              { name: "Agents", desc: "5 built-in + Dreams" },
              { name: "Autopilot", desc: "Two toggles + activity feed" },
              { name: "Memory", desc: "Suggestions + Tick Log" },
              { name: "Skills", desc: "Library + Marketplace" },
              { name: "AI Tools", desc: "Plug-ins, Config, Prefs" },
              { name: "Providers", desc: "BYOK + local model" },
              { name: "Activity", desc: "Live event feed" },
              { name: "Projects", desc: "Folder management" },
              { name: "Notes", desc: "Manual + voice notes" },
              { name: "Signal", desc: "Phone bridge" },
              { name: "Backup", desc: "Scheduled auto-backup" },
              { name: "Guide", desc: "Built-in docs" },
              { name: "Settings", desc: "App settings" },
            ].map((tab) => (
              <div
                key={tab.name}
                className="bg-[#f8f9fb] rounded-lg p-4 border border-[#dbdbdb] text-center feature-card"
              >
                <p className="text-[#0061aa] font-semibold text-base mb-1">
                  {tab.name}
                </p>
                <p className="text-[#777777] text-xs">{tab.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXCHANGE CTA ─── */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#f8f9fb] rounded-2xl p-8 sm:p-12 border border-[#dbdbdb] text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-3">
              AI Skills Exchange
            </h2>
            <p className="text-lg text-[#777777] mb-6 max-w-xl mx-auto">
              Browse hundreds of skills, prompts, configs, and tools shared by
              the community. Works with Claude, ChatGPT, Gemini, Cursor, and more.
            </p>
            <Link
              href="/exchange"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white font-semibold text-lg transition-colors"
            >
              Browse the Exchange
            </Link>
            <p className="mt-3 text-sm text-[#999999]">
              Free to use. Free to share. No account needed to browse.
            </p>
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
            Download MakoBot, add your project folders, never re-explain your
            work to an AI again — and call any plug-in for a second opinion
            when an answer matters. Free. Private. No account needed.
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
