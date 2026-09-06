import type { Metadata } from "next";
import { MAKOBOT_BUILD } from "@/lib/version";

export const metadata: Metadata = {
  alternates: { canonical: "https://makobot.com" },
};
import {
  Logo,
  AiBadge,
  FeatureCard,
  Glyph,
  SectionHeading,
  Nav,
  Footer,
} from "./components";

/* VERSIONED FILENAMES for everything under /images and /videos. They are served
   with "Cache-Control: public, max-age=31536000, immutable", so a browser that
   has a file will never ask for it again, not even on a hard refresh. Swapping
   bytes under an existing name reaches nobody who has already visited. Bump the
   -vN suffix on every replacement. (hero-robot-v2.mp4 was the last video hero;
   v3 is a still, built around the robot and nothing else.) */
const HERO_IMG = "/images/hero-v3.webp";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Nav />

      {/* ─── HERO ─── */}
      <section id="hero" className="relative pt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl border border-[#dbdbdb] bg-[#eef2f7] shadow-[0_18px_50px_rgba(29,53,84,0.12)]">
            {/* Native 1376x768. Kept inside the content column rather than
                stretched edge to edge, so it is never upscaled past its pixels. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMG}
              alt="MakoBot, a small round silver robot with a glass dome and glowing blue eyes"
              width={1376}
              height={768}
              fetchPriority="high"
              decoding="async"
              className="block w-full h-auto"
            />
          </div>
        </div>

        <div className="relative isolate flex flex-col items-center justify-center px-6 pt-14 pb-16">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#0061aa] opacity-[0.07] blur-[120px] pointer-events-none -z-10" />

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center max-w-4xl leading-tight mb-4">
            An assistant that lives on your PC{" "}
            <span className="gradient-text">and never forgets.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#0061aa] text-center font-semibold mb-6 tracking-wide">
            Mail, calendar, voice, memory. All on your own Windows machine.
          </p>

          <p className="text-lg sm:text-xl text-[#555555] text-center max-w-3xl mb-4 leading-relaxed">
            MakoBot watches your inbox, keeps your calendar and to-do list, talks
            and listens, and remembers every project and every conversation. She
            briefs{" "}
            <span className="text-[#333333] font-semibold">Claude Code</span> and
            the other AI tools you already use, so nothing has to be explained
            twice. Her brain runs on your Claude plan. Her memory stays on your
            disk.
          </p>

          <p className="text-base text-[#777777] text-center max-w-2xl mb-8 leading-relaxed">
            Free. No subscription. Nothing leaves your desk unless you send it.
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
              See what she does
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <AiBadge name="Claude Code" />
            <AiBadge name="Claude.ai" />
            <AiBadge name="ChatGPT" />
            <AiBadge name="Gemini" />
            <AiBadge name="Outlook" />
            <AiBadge name="Gmail" />
          </div>

          <p className="text-sm text-[#999999]">
            Windows 10 and 11. Build {MAKOBOT_BUILD}, signed by Mako Logics LLC.
          </p>
        </div>
      </section>

      {/* ─── A DAY WITH HER ─── */}
      <section className="px-6 py-20 bg-[#eef2f7]">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading
            title="A day with MakoBot"
            subtitle="She is there before you sit down and still there after you leave."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="sunrise" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                7:45 in the morning
              </p>
              <p className="text-[#777777] text-sm">
                She has read the overnight mail and checked the calendar. If you
                asked for the briefing, she says it out loud.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="shield" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                The email that looks like your bank
              </p>
              <p className="text-[#777777] text-sm">
                She checks the sender&apos;s own authentication records and tells
                you whether it is genuine before you click anything.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <Glyph name="brain" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                You open Claude Code
              </p>
              <p className="text-[#777777] text-sm">
                It already knows yesterday&apos;s commits, the decision you made
                on Tuesday, and what is still open. You start working.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT SHE DOES ─── */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="What she does"
            subtitle="Six things you will use every day."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <FeatureCard
              icon="message"
              title="Your inbox, watched"
              description="Outlook, Gmail, iCloud and Yahoo. She watches every mailbox in the background, tells real mail from forged mail, and raises the ones that matter. She can draft and send replies, and every send waits for your approval. No setting turns that gate off."
            />
            <FeatureCard
              icon="list"
              title="Calendar and to-do"
              description="Your Microsoft calendar and to-do list live inside the app, by month or by week. She creates and edits entries, keeps the team list separate from yours, and can read the day out."
            />
            <FeatureCard
              icon="mic"
              title="Talk to her"
              description="Whisper runs on your machine, so your voice never leaves it. She answers in a natural voice and starts speaking after the first sentence instead of waiting for the whole reply. Turn on the wake phrase and say her name."
            />
            <FeatureCard
              icon="phone"
              title="From your phone"
              description="A private chat page over your own Tailscale network, with push notifications to your iPhone. If Tailscale is not running there is no page at all. Nothing else listens on the network."
            />
            <FeatureCard
              icon="activity"
              title="Routines you approve"
              description="A spoken morning briefing on weekdays, an end-of-day check, a Friday wrap-up. She suggests them once. Nothing runs until you say yes, and a routine can only look, never act."
            />
            <FeatureCard
              icon="agents"
              title="A second opinion"
              description="One button brings another AI into the chat as a critic. It sees the conversation and her answer, is told to lead with the most serious problem, and has no tools. Only she acts, and only with your approval."
            />
          </div>
        </div>
      </section>

      {/* ─── MEMORY ─── */}
      <section id="memory" className="px-6 py-20 bg-[#eef2f7]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="She remembers everything"
            subtitle="Full records on your own disk. Not bullet points on someone's server."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <h3 className="text-lg font-semibold text-[#333333] mb-3">What goes in</h3>
              <ul className="space-y-3 text-sm text-[#555555] leading-relaxed">
                <li>One brain across all your work, plus a context file for every project.</li>
                <li>Every conversation, saved in full. Never trimmed, never summarized away.</li>
                <li>Your Claude Code sessions as readable transcripts, and every commit as it lands.</li>
                <li>Your ChatGPT, Claude.ai and Gemini chats, captured by a small browser extension.</li>
                <li>Notes she writes herself. A few minutes after a chat goes quiet she rereads it and saves at most two.</li>
              </ul>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <h3 className="text-lg font-semibold text-[#333333] mb-3">How it stays safe</h3>
              <ul className="space-y-3 text-sm text-[#555555] leading-relaxed">
                <li>Search by words or by meaning. The meaning search runs on your machine with a local model.</li>
                <li>A backup every night, and dated archives when a file gets big. Nothing is ever deleted to make room.</li>
                <li>An encrypted sync carries the same memory to your other computers through a folder you already use. It can only add, so a new laptop can never wipe an old desktop.</li>
                <li>Every night or so she rereads her own notes for contradictions and patterns, and writes down what she noticed.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLAUDE CODE ─── */}
      <section id="claude-code" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="The front door for Claude Code"
            subtitle="Every AI tool has its own memory now. Every one of them is a silo. She sits above them."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] text-center">
              <Glyph name="network" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                Connected on its own
              </p>
              <p className="text-[#777777] text-sm leading-relaxed">
                Add a project folder and Claude Code gets her memory tools in that
                project automatically. She keeps the access keys healthy so
                nothing silently breaks.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] text-center">
              <Glyph name="dashboard" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                She sees who is working
              </p>
              <p className="text-[#777777] text-sm leading-relaxed">
                Live Claude Code sessions show up in the app as they start, yours
                in VS Code and hers in the background, so you always know what is
                running.
              </p>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb] text-center">
              <Glyph name="wall" className="w-8 h-8 text-[#0061aa] mb-3 mx-auto" />
              <p className="text-[#333333] text-base font-medium mb-2">
                Any tool that speaks MCP
              </p>
              <p className="text-[#777777] text-sm leading-relaxed">
                Her memory server runs on your machine only. Cursor and any other
                MCP client can search the memory, read the brain, and add a note.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-[#ffffff] to-[#f8f9fb] rounded-xl border border-[#0061aa]/40 p-8 text-center">
            <p className="text-xl sm:text-2xl font-bold text-[#333333] mb-3">
              What Claude remembers stays in Claude. What ChatGPT remembers stays in ChatGPT.
            </p>
            <p className="text-[#0061aa] text-base font-semibold">
              MakoBot remembers for you, and tells all of them.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PROTECTION ─── */}
      <section id="safety" className="px-6 py-20 bg-[#eef2f7]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="How she protects you"
            subtitle="An assistant that reads your mail has to be careful. This one is."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <FeatureCard
              icon="lock"
              title="Passwords stay sealed"
              description="Mailbox passwords are encrypted with Windows' own protection. They are never written in the clear, never logged, and never shown back to the screen."
            />
            <FeatureCard
              icon="scan"
              title="Secrets scrubbed"
              description="API keys, tokens and connection strings are scrubbed before anything is saved to memory, written to a transcript, or shown to a second AI."
            />
            <FeatureCard
              icon="key"
              title="Signed updates only"
              description="An update is refused unless it carries a valid signature issued to Mako Logics LLC. An unsigned file, or one signed by anyone else, never runs."
            />
            <FeatureCard
              icon="shield"
              title="Knows where not to look"
              description="She will not fetch addresses inside your own network, and she will not read Junk or Deleted mail on her own. Every send, reply, forward and delete waits for you."
            />
          </div>
        </div>
      </section>

      {/* ─── RELIABILITY ─── */}
      <section id="reliability" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="Built to keep running"
            subtitle="She never shuts herself down, and she tells you when something is wrong."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <ul className="space-y-3 text-sm text-[#555555] leading-relaxed">
                <li><span className="text-[#333333] font-semibold">A daily self-check</span> across eighteen conditions, from an unreachable mailbox to a stale backup. It reports facts, not a green badge.</li>
                <li><span className="text-[#333333] font-semibold">Vitals with numbers.</span> Low disk, an oversized memory file, a backup older than three days.</li>
                <li><span className="text-[#333333] font-semibold">A stall watchdog</span> that names the exact tool that froze the app, instead of leaving you to guess.</li>
              </ul>
            </div>
            <div className="bg-[#f8f9fb] rounded-xl p-6 border border-[#dbdbdb]">
              <ul className="space-y-3 text-sm text-[#555555] leading-relaxed">
                <li><span className="text-[#333333] font-semibold">Files that heal.</span> If a settings or memory file is ever corrupted, the damaged copy is set aside and a fresh one is written. Nothing is lost silently.</li>
                <li><span className="text-[#333333] font-semibold">A cost meter</span> on every chat, measured against your Claude plan, so you can see the spend before the limit sees you.</li>
                <li><span className="text-[#333333] font-semibold">Updates that verify themselves.</span> Download, check the signature, then run. Never the other way round.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DOWNLOAD CTA ─── */}
      <section id="download" className="px-6 py-24 bg-[#eef2f7]">
        <div className="max-w-3xl mx-auto text-center">
          <Logo size={80} />
          <h2 className="text-3xl sm:text-4xl font-bold mt-8 mb-4">
            Ready to meet her?
          </h2>
          <p className="text-lg text-[#555555] mb-8 max-w-xl mx-auto">
            Download MakoBot, add a mailbox or a project folder, and let her
            start remembering. Free, on your machine, no subscription.
          </p>

          <a
            href="/get-key"
            className="inline-flex items-center justify-center px-10 py-5 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white font-semibold text-xl transition-colors blue-glow"
          >
            Get Free Key + Download
          </a>

          <p className="mt-4 text-sm text-[#999999]">
            Windows 10 and 11 · about 240 MB · Build {MAKOBOT_BUILD} · Digitally signed by Mako Logics LLC
          </p>
          <p className="mt-2 text-xs text-[#777777]">
            Verified by Microsoft Azure Trusted Signing, so there are no SmartScreen warnings
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <AiBadge name="Claude Code" />
            <AiBadge name="Claude.ai" />
            <AiBadge name="ChatGPT" />
            <AiBadge name="Gemini" />
            <AiBadge name="Outlook" />
            <AiBadge name="Gmail" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
