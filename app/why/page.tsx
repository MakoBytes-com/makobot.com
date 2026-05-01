import type { Metadata } from "next";
import { Logo, Nav, Footer, SectionHeading, FeatureCard } from "../components";

export const metadata: Metadata = {
  title: "Why MakoBot — What it really does, in plain English",
  description:
    "MakoBot saves you hours every week by giving your AI tools a permanent searchable memory. No more re-explaining your project. No more lost decisions. No more switching tools just to remember what you did last week.",
  alternates: { canonical: "https://makobot.com/why" },
};

export default function WhyPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Nav />

      {/* ─── HERO ─── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#3B82F6] opacity-[0.07] blur-[120px] pointer-events-none" />

        <div className="mb-8">
          <Logo size={80} />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center max-w-4xl leading-tight mb-6">
          What MakoBot{" "}
          <span className="gradient-text">actually does</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#C0C8D8] text-center max-w-3xl mb-4 leading-relaxed">
          You use AI to build things. Every chat starts fresh, every tool is an
          island, and you re-explain your project five times a day.
        </p>

        <p className="text-base text-[#8B95A8] text-center max-w-2xl">
          MakoBot fixes that. Below — concretely — here&apos;s what changes
          and how much time it saves.
        </p>
      </section>

      {/* ─── BEFORE / AFTER ─── */}
      <section className="px-6 py-16 max-w-6xl mx-auto w-full">
        <SectionHeading
          title="Before vs. after"
          subtitle="Real workflows. Real time saved."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BEFORE */}
          <div className="bg-[#1E2330] rounded-xl border border-[#374151] p-6">
            <div className="text-xs font-bold text-[#DC2626] mb-3 tracking-wide">BEFORE MAKOBOT</div>
            <h3 className="text-lg font-semibold text-[#E8EDF3] mb-4">
              Starting a fresh Claude Code chat
            </h3>
            <ol className="space-y-3 text-sm text-[#C0C8D8] leading-relaxed">
              <li><span className="text-[#DC2626] font-mono mr-2">10:00</span> Open Claude Code in VS Code</li>
              <li><span className="text-[#DC2626] font-mono mr-2">10:01</span> Start a new chat — Claude has no memory of yesterday</li>
              <li><span className="text-[#DC2626] font-mono mr-2">10:02</span> Type 6 paragraphs explaining the project, what you&apos;re working on, what was decided last week, what tools you use</li>
              <li><span className="text-[#DC2626] font-mono mr-2">10:08</span> Realize you forgot to mention the database schema. Paste it in.</li>
              <li><span className="text-[#DC2626] font-mono mr-2">10:10</span> Realize Claude needs to know about the deploy issue from Tuesday. Search your old chats. Copy-paste.</li>
              <li><span className="text-[#DC2626] font-mono mr-2">10:14</span> Finally start working</li>
            </ol>
            <p className="mt-5 text-sm text-[#8B95A8] italic">14 minutes burned before any actual work happens. Five times a day = ~1 hour gone.</p>
          </div>

          {/* AFTER */}
          <div className="bg-gradient-to-br from-[#1E2330] to-[#252B3B] rounded-xl border border-[#3B82F6]/40 p-6">
            <div className="text-xs font-bold text-[#10B981] mb-3 tracking-wide">WITH MAKOBOT</div>
            <h3 className="text-lg font-semibold text-[#E8EDF3] mb-4">
              Starting a fresh Claude Code chat
            </h3>
            <ol className="space-y-3 text-sm text-[#C0C8D8] leading-relaxed">
              <li><span className="text-[#10B981] font-mono mr-2">10:00</span> Open Claude Code in VS Code</li>
              <li><span className="text-[#10B981] font-mono mr-2">10:00</span> Type <code className="bg-[#0F1419] px-2 py-0.5 rounded text-[#3B82F6]">Recover</code></li>
              <li><span className="text-[#10B981] font-mono mr-2">10:00</span> Claude reads MakoBot&apos;s injected context — already knows your projects, recent commits, last session, current build, open decisions</li>
              <li><span className="text-[#10B981] font-mono mr-2">10:00</span> Start working</li>
            </ol>
            <p className="mt-5 text-sm text-[#3B82F6] italic">Under 30 seconds. ~1 hour back per day.</p>
          </div>
        </div>
      </section>

      {/* ─── SEARCH (HEADLINE FEATURE) ─── */}
      <section className="px-6 py-16 bg-[#1A1F2E]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="The feature users love most"
            subtitle="Search across every conversation, every project, every AI tool"
          />

          <div className="bg-gradient-to-br from-[#252B3B] to-[#1E2330] rounded-xl border border-[#3B82F6]/30 p-6 sm:p-10 mb-8">
            <p className="text-[#C0C8D8] text-base leading-relaxed mb-5">
              You&apos;re working on a project and you remember Claude solved
              this exact bug for you a few weeks ago — but on a different
              project. You can&apos;t find the chat anymore.{" "}
              <span className="text-[#E8EDF3] font-semibold">Without MakoBot,
              you re-derive the answer (10–30 minutes).</span>
            </p>
            <p className="text-[#C0C8D8] text-base leading-relaxed mb-5">
              With MakoBot, you type one word into the search bar:
            </p>
            <div className="bg-[#0F1419] rounded-lg p-4 mb-5 border border-[#374151]">
              <code className="text-[#3B82F6] text-base">race condition</code>
            </div>
            <p className="text-[#C0C8D8] text-base leading-relaxed">
              Five seconds later you have the conversation, the file, the fix,
              and the project it was for.{" "}
              <span className="text-[#3B82F6] font-semibold">
                That&apos;s the feature MakoBot users tell me they love most.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#252B3B] rounded-xl p-5 border border-[#374151]">
              <h4 className="text-base font-semibold text-[#E8EDF3] mb-3">What MakoBot search reaches</h4>
              <ul className="space-y-2 text-sm text-[#C0C8D8]">
                <li>• Cross-project brain (every commit + decision)</li>
                <li>• Per-project context.md files</li>
                <li>• Manual notes you saved</li>
                <li>• Transcripts from Claude Code, Cursor, ChatGPT, Gemini</li>
                <li>• Auto-extracted patterns and decisions</li>
                <li>• Skill content + Commands (God Mode rules)</li>
                <li>• Clipboard imports from any web AI tool</li>
              </ul>
            </div>
            <div className="bg-[#252B3B] rounded-xl p-5 border border-[#374151]">
              <h4 className="text-base font-semibold text-[#E8EDF3] mb-3">Real searches users run</h4>
              <ul className="space-y-2 text-sm text-[#C0C8D8] font-mono">
                <li>→ <span className="text-[#3B82F6]">webhook</span> &nbsp;<span className="text-[#8B95A8] font-sans not-italic">— which client was that for?</span></li>
                <li>→ <span className="text-[#3B82F6]">deploy fix</span> &nbsp;<span className="text-[#8B95A8] font-sans not-italic">— what command did I run?</span></li>
                <li>→ <span className="text-[#3B82F6]">stripe</span> &nbsp;<span className="text-[#8B95A8] font-sans not-italic">— that integration approach</span></li>
                <li>→ <span className="text-[#3B82F6]">CLAUDE.md</span> &nbsp;<span className="text-[#8B95A8] font-sans not-italic">— what I told Claude last month</span></li>
                <li>→ <span className="text-[#3B82F6]">404</span> &nbsp;<span className="text-[#8B95A8] font-sans not-italic">— which project had that bug</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TIME SAVED MATH ─── */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <SectionHeading
          title="The actual math on time saved"
          subtitle="Conservative numbers."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#252B3B] rounded-xl p-6 border border-[#374151] text-center">
            <p className="text-4xl font-bold text-[#3B82F6] mb-2">~10 min</p>
            <p className="text-sm text-[#C0C8D8] leading-relaxed">
              saved per fresh AI chat by skipping the &quot;re-explain the
              project&quot; ritual
            </p>
          </div>
          <div className="bg-[#252B3B] rounded-xl p-6 border border-[#374151] text-center">
            <p className="text-4xl font-bold text-[#3B82F6] mb-2">~15 min</p>
            <p className="text-sm text-[#C0C8D8] leading-relaxed">
              saved per &quot;I know I solved this before&quot; moment via search
            </p>
          </div>
          <div className="bg-[#252B3B] rounded-xl p-6 border border-[#374151] text-center">
            <p className="text-4xl font-bold text-[#3B82F6] mb-2">~5 hrs</p>
            <p className="text-sm text-[#C0C8D8] leading-relaxed">
              saved per week for an active builder using AI 4–8 hours/day
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-[#8B95A8] max-w-2xl mx-auto leading-relaxed">
          Numbers are conservative estimates from active users. Your mileage
          depends on how often you start fresh AI chats and how much you
          context-switch between projects.
        </p>
      </section>

      {/* ─── WHO IT'S FOR ─── */}
      <section className="px-6 py-16 bg-[#1A1F2E]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Who actually needs this"
            subtitle="Most AI productivity tools are made by engineers, for engineers. MakoBot isn't."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon="🚀"
              title="Solo founders + non-developer builders"
              description="You're running a real business on top of AI tools. You can't hire engineers, but you CAN direct AI. Your bottleneck isn't the AI — it's losing context every time you open a fresh chat."
            />
            <FeatureCard
              icon="🧑‍💼"
              title="Freelancers + small agencies"
              description="Five to ten client projects. You context-switch every day. Without cross-project memory you re-onboard yourself into every chat. Search across every client's history is the killer feature for you."
            />
            <FeatureCard
              icon="🏢"
              title="MSPs + IT consultants"
              description="Every job is different. Memory + Skills + Commands turn AI into an actual member of your team that remembers every client's stack, every quirk, every decision."
            />
            <FeatureCard
              icon="⚖️"
              title="Compliance-conscious builders"
              description="Lawyers, healthcare, finance — you want AI productivity but can't paste sensitive data into ChatGPT. BYOK + 100% local + DPAPI-encrypted keys + Verify Mode for second-opinions on AI output."
            />
          </div>
        </div>
      </section>

      {/* ─── BUILT BY A NON-DEVELOPER ─── */}
      <section className="px-6 py-16 max-w-4xl mx-auto w-full">
        <div className="bg-gradient-to-br from-[#252B3B] to-[#1E2330] rounded-xl border border-[#3B82F6]/30 p-6 sm:p-10">
          <div className="text-xs font-bold text-[#3B82F6] mb-3 tracking-wide">THE STORY</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E8EDF3] mb-5 leading-tight">
            Built by a non-developer, for non-developers
          </h2>
          <p className="text-[#C0C8D8] text-base leading-relaxed mb-4">
            Most AI tools are made by engineers who already live in a terminal.
            They assume you know how to install an MCP server, configure
            CLAUDE.md by hand, manage API keys, set up a JSON-RPC bearer
            token, and write your own memory adapters.
          </p>
          <p className="text-[#C0C8D8] text-base leading-relaxed mb-4">
            MakoBot is built by someone who isn&apos;t an engineer — who runs
            a real business that ships real client work using AI tools — and
            who wanted a workbench that just works for someone like that.
          </p>
          <p className="text-[#E8EDF3] text-base leading-relaxed font-medium">
            That&apos;s why MakoBot is a real Windows app with an installer,
            a license key, an in-app updater, big readable UI, and a search
            bar — instead of a CLI that assumes you can compile Rust.
          </p>
        </div>
      </section>

      {/* ─── BIG PICTURE ─── */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <SectionHeading
          title="The big picture"
          subtitle="MakoBot isn't a model. It's the layer that makes every model you use better."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#252B3B] rounded-xl p-6 border border-[#374151]">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-base font-semibold text-[#E8EDF3] mb-2">Memory</h3>
            <p className="text-sm text-[#C0C8D8] leading-relaxed">
              Cross-project timeline auto-injected into CLAUDE.md, AGENTS.md,
              .cursorrules. Every AI tool you use sees the same context.
            </p>
          </div>
          <div className="bg-[#252B3B] rounded-xl p-6 border border-[#374151]">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-base font-semibold text-[#E8EDF3] mb-2">Search</h3>
            <p className="text-sm text-[#C0C8D8] leading-relaxed">
              One bar that reaches every conversation, every commit, every note,
              every transcript — across every project, every AI tool you use.
            </p>
          </div>
          <div className="bg-[#252B3B] rounded-xl p-6 border border-[#374151]">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-base font-semibold text-[#E8EDF3] mb-2">AI Tools</h3>
            <p className="text-sm text-[#C0C8D8] leading-relaxed">
              <code className="bg-[#0F1419] px-1.5 py-0.5 rounded text-xs text-[#3B82F6]">@verify</code>{" "}
              <code className="bg-[#0F1419] px-1.5 py-0.5 rounded text-xs text-[#3B82F6]">@audit</code>{" "}
              <code className="bg-[#0F1419] px-1.5 py-0.5 rounded text-xs text-[#3B82F6]">@codereview</code>{" "}
              <code className="bg-[#0F1419] px-1.5 py-0.5 rounded text-xs text-[#3B82F6]">@designreview</code>{" "}
              <code className="bg-[#0F1419] px-1.5 py-0.5 rounded text-xs text-[#3B82F6]">@contractreview</code>{" "}
              — fan out to GPT, Claude, and Gemini for second opinions.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 py-20 bg-[#1A1F2E]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Stop re-explaining your work to AI
          </h2>
          <p className="text-[#C0C8D8] text-base mb-8 max-w-2xl mx-auto">
            Free key, free download. Runs entirely on your Windows PC. Your
            data, your API keys, your bills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/get-key"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-lg transition-colors"
            >
              Get Free Key + Download
            </a>
            <a
              href="/compare"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-[#374151] hover:border-[#4B5563] text-[#C0C8D8] font-medium text-lg transition-colors"
            >
              Compare to other tools
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
