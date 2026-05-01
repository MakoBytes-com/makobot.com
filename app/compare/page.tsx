import type { Metadata } from "next";
import { Logo, Nav, Footer, SectionHeading, FeatureCard } from "../components";

export const metadata: Metadata = {
  title: "How MakoBot Compares — vs. Zen MCP, Recallium, Mem0, Multi-LLM Cross-Check",
  description:
    "An honest comparison: MakoBot is layered ABOVE your existing AI tools (Claude Code, Cursor, Windsurf), not a replacement for them. See how it overlaps with Zen MCP, Recallium, claude-mem, Mem0, and the Multi-LLM Cross-Check MCP server — and where it's genuinely different.",
  alternates: { canonical: "https://makobot.com/compare" },
};

export default function ComparePage() {
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
          Honest comparison —{" "}
          <span className="gradient-text">where MakoBot fits</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#C0C8D8] text-center max-w-3xl mb-4 leading-relaxed">
          MakoBot makes your existing AI tools smarter — it&apos;s not a
          replacement for them.
        </p>

        <p className="text-base text-[#8B95A8] text-center max-w-2xl">
          We checked the landscape. Here&apos;s the honest read: what other
          tools do well, where MakoBot overlaps, and where the bundle is
          genuinely different.
        </p>
      </section>

      {/* ─── POSITIONING ─── */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <SectionHeading
          title="How MakoBot is positioned"
          subtitle="Not beside the agent loop — above it."
        />

        <div className="bg-[#252B3B] rounded-xl border border-[#374151] p-6 sm:p-10 mb-8">
          <p className="text-[#C0C8D8] text-base leading-relaxed mb-6">
            Modern AI coding tools — Claude Code, Cursor, Windsurf, Aider —
            already run their own multi-step agent loops. They read files,
            grep for patterns, follow references, and build a plan, all
            autonomously. That&apos;s their whole product.
          </p>
          <p className="text-[#C0C8D8] text-base leading-relaxed mb-6">
            MakoBot doesn&apos;t try to replace that loop. It sits one layer
            above as a <span className="text-[#3B82F6] font-semibold">multi-model
            second-opinion service</span> and a{" "}
            <span className="text-[#3B82F6] font-semibold">cross-project memory
            backbone</span>. When your agent reads a file and wants a sanity
            check, it calls{" "}
            <code className="bg-[#1E2330] px-2 py-0.5 rounded text-[#3B82F6]">
              @verify
            </code>{" "}
            or{" "}
            <code className="bg-[#1E2330] px-2 py-0.5 rounded text-[#3B82F6]">
              @audit
            </code>{" "}
            on MakoBot — Claude, GPT, and Gemini all weigh in. Your agent
            keeps driving; MakoBot just makes the answers better.
          </p>
          <p className="text-[#C0C8D8] text-base leading-relaxed">
            That&apos;s why MakoBot plays nicely with Claude Code, Cursor,
            Windsurf, and Aider all at once — instead of competing with any
            of them. The injected{" "}
            <code className="bg-[#1E2330] px-2 py-0.5 rounded text-[#8B95A8]">
              CLAUDE.md
            </code>
            ,{" "}
            <code className="bg-[#1E2330] px-2 py-0.5 rounded text-[#8B95A8]">
              AGENTS.md
            </code>
            , and{" "}
            <code className="bg-[#1E2330] px-2 py-0.5 rounded text-[#8B95A8]">
              .cursorrules
            </code>{" "}
            files mean every tool you use sees the same context.
          </p>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section className="px-6 py-16 bg-[#1A1F2E]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Side-by-side"
            subtitle="What overlaps, what doesn't."
          />

          <div className="bg-[#252B3B] rounded-xl border border-[#374151] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1E2330] text-[#E8EDF3]">
                    <th className="text-left py-4 px-4 font-semibold">Capability</th>
                    <th className="text-center py-4 px-3 font-semibold text-[#3B82F6]">MakoBot</th>
                    <th className="text-center py-4 px-3 font-semibold">Zen MCP</th>
                    <th className="text-center py-4 px-3 font-semibold">Recallium</th>
                    <th className="text-center py-4 px-3 font-semibold">claude-mem</th>
                    <th className="text-center py-4 px-3 font-semibold">Mem0</th>
                    <th className="text-center py-4 px-3 font-semibold">Multi-LLM<br/>Cross-Check</th>
                  </tr>
                </thead>
                <tbody>
                  <Row
                    feature="Cross-project memory injection (auto-writes CLAUDE.md / AGENTS.md / .cursorrules)"
                    cells={[true, false, true, false, false, false]}
                  />
                  <Row
                    feature="Multi-model second-opinion (verify / audit / code review / design review / contract review)"
                    cells={[true, true, false, false, false, "verify only"]}
                  />
                  <Row
                    feature="BYOK direct to providers (no proxy)"
                    cells={[true, true, "n/a", "n/a", "API service", true]}
                  />
                  <Row
                    feature="Plug-in architecture (add new tools without editing the engine)"
                    cells={[true, true, false, false, false, false]}
                  />
                  <Row
                    feature="Skills + Commands (rules injected into every project)"
                    cells={[true, false, false, false, false, false]}
                  />
                  <Row
                    feature="Native desktop UI (not CLI / not browser extension)"
                    cells={[true, false, false, false, false, false]}
                  />
                  <Row
                    feature="Signed Windows installer + auto-updater"
                    cells={[true, false, false, false, false, false]}
                  />
                  <Row
                    feature="Works with Claude Code, Cursor, Windsurf, Aider — all at once"
                    cells={[true, "yes", "yes", "Claude Code only", "n/a", "yes"]}
                  />
                  <Row
                    feature="Local model support (Ollama / LM Studio)"
                    cells={[false, true, false, false, false, false]}
                  />
                  <Row
                    feature="Built-in autonomous agent loop"
                    cells={["uses host's", true, false, false, false, false]}
                  />
                  <Row
                    feature="Designed for non-developers"
                    cells={[true, false, false, false, false, false]}
                  />
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-[#6B7280] mt-4 text-center">
            Comparison data based on each project&apos;s public docs and pricing pages, April 2026.
          </p>
        </div>
      </section>

      {/* ─── EACH COMPETITOR SHORT TAKE ─── */}
      <section className="px-6 py-16 max-w-6xl mx-auto w-full">
        <SectionHeading
          title="Where each tool wins"
          subtitle="None of these are bad — they're aimed at different jobs."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon="🧠"
            title="Recallium"
            description="Best-in-class cross-IDE memory. If you only need shared context between Cursor + Claude Code + VS Code and nothing else, this is the leanest path. MakoBot does the same thing AND adds AI Tools + Skills + an installer-grade UX."
          />
          <FeatureCard
            icon="🤖"
            title="Zen MCP Server"
            description="Heavy autonomous agent loops with stepwise planning, root cause analysis, and Ollama support. Best for engineers who want their MCP server to drive the analysis itself. MakoBot delegates that loop to Claude Code / Cursor and focuses on multi-model verification."
          />
          <FeatureCard
            icon="📦"
            title="Mem0 / Letta / Zep / Memstate"
            description="Memory-as-a-service APIs for developers building their own AI products. Not end-user tools. If you're shipping a SaaS that needs memory infrastructure, look here. If you want a desktop app that already works, look at MakoBot."
          />
          <FeatureCard
            icon="🔍"
            title="claude-mem"
            description="Lightweight Claude Code session capture + replay. Single-tool, single-IDE. MakoBot's Memory pillar covers this and extends to every AI tool you use."
          />
          <FeatureCard
            icon="✅"
            title="Multi-LLM Cross-Check MCP"
            description="The closest equivalent to MakoBot's @verify. Same idea — fan a draft answer out to multiple LLMs and return all opinions. MCP-only, no UI. MakoBot bundles this with audit / code_review / design_review / contract_review under the AI Tools tab."
          />
          <FeatureCard
            icon="🌐"
            title="MultiLLM Chrome / LLM Onestop / AskAll"
            description="Browser-based side-by-side comparison tools. Useful for casual chat use, but not integrated with your AI coding tools. Different category."
          />
        </div>
      </section>

      {/* ─── WHEN TO PICK WHAT ─── */}
      <section className="px-6 py-16 bg-[#1A1F2E]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="When MakoBot is the right fit"
            subtitle="And when something else might be."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#252B3B] rounded-xl border border-[#3B82F6]/40 p-6">
              <div className="text-2xl mb-3">✓</div>
              <h3 className="text-lg font-semibold text-[#E8EDF3] mb-3">Pick MakoBot if…</h3>
              <ul className="space-y-3 text-sm text-[#C0C8D8] leading-relaxed">
                <li>You use multiple AI coding tools and want them to share context.</li>
                <li>You want second opinions from GPT and Gemini on Claude&apos;s answers (or vice versa).</li>
                <li>You&apos;re not a CLI person and want a real Windows app with an installer.</li>
                <li>You want to run audits and code reviews on demand without setting up agent infrastructure.</li>
                <li>You want your API keys and data to stay on your machine.</li>
                <li>You want to write rules once and have every AI tool follow them.</li>
              </ul>
            </div>

            <div className="bg-[#252B3B] rounded-xl border border-[#374151] p-6">
              <div className="text-2xl mb-3">→</div>
              <h3 className="text-lg font-semibold text-[#E8EDF3] mb-3">Pick something else if…</h3>
              <ul className="space-y-3 text-sm text-[#C0C8D8] leading-relaxed">
                <li>You only need memory and nothing else — <span className="text-[#3B82F6]">Recallium</span> is leaner.</li>
                <li>You want a fully autonomous agent that drives its own multi-step analysis — <span className="text-[#3B82F6]">Zen MCP</span> is heavier.</li>
                <li>You need local model support (Ollama / LM Studio) today — <span className="text-[#3B82F6]">Zen MCP</span> has it; MakoBot doesn&apos;t yet.</li>
                <li>You&apos;re building a SaaS that needs memory infrastructure as a feature — <span className="text-[#3B82F6]">Mem0</span> or <span className="text-[#3B82F6]">Letta</span>.</li>
                <li>You only want side-by-side chat compare — a browser extension is enough.</li>
                <li>You&apos;re on Mac or Linux only — MakoBot is Windows for now.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE BUNDLE ─── */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <SectionHeading
          title="The bundle is the moat"
          subtitle="None of the parts are revolutionary. The combination is."
        />

        <div className="bg-gradient-to-br from-[#252B3B] to-[#1E2330] rounded-xl border border-[#3B82F6]/30 p-6 sm:p-10">
          <p className="text-[#C0C8D8] text-base leading-relaxed mb-4">
            Cross-IDE memory exists. Multi-LLM verification exists. MCP plug-in
            architectures exist. Skills exist. The honest read: each piece is
            available somewhere.
          </p>
          <p className="text-[#C0C8D8] text-base leading-relaxed mb-4">
            MakoBot is the first to combine all of them in a{" "}
            <span className="text-[#3B82F6] font-semibold">single Windows-native
            desktop app, with a real UI, a signed installer, an in-app updater,
            and a license key</span> — designed for people who don&apos;t want to
            stitch four CLI tools together.
          </p>
          <p className="text-[#C0C8D8] text-base leading-relaxed">
            That&apos;s the bet:{" "}
            <span className="text-[#E8EDF3] font-semibold">most people who would
            benefit from these tools never will, because the existing ones
            assume you live in a terminal.</span>{" "}
            MakoBot is for everyone else.
          </p>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Try it on your own setup
          </h2>
          <p className="text-[#C0C8D8] text-base mb-8">
            Free key, free download. Runs entirely on your machine. Your keys,
            your data, your bills.
          </p>
          <a
            href="/get-key"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-lg transition-colors"
          >
            Get Free Key + Download
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ─── Local row component (richer than the existing CompetitorRow — supports
       text labels, not just check/cross) ─── */
function Row({
  feature,
  cells,
}: {
  feature: string;
  cells: (boolean | string)[];
}) {
  return (
    <tr className="border-b border-[#374151]/50 hover:bg-[#1E2330]/40">
      <td className="py-3 px-4 text-sm text-[#C0C8D8]">{feature}</td>
      {cells.map((v, i) => (
        <td key={i} className="py-3 px-3 text-center">
          {v === true ? (
            <span className="text-[#10B981] font-bold text-lg">✓</span>
          ) : v === false ? (
            <span className="text-[#6B7280] font-bold text-lg">✗</span>
          ) : (
            <span className="text-xs text-[#8B95A8] italic">{v}</span>
          )}
        </td>
      ))}
    </tr>
  );
}
