import type { Metadata } from "next";
import { Logo, Nav, Footer, SectionHeading, FeatureCard } from "../components";

export const metadata: Metadata = {
  title: "How MakoBot Compares — vs. Built-in AI Memory, Cloud Assistants, and Server Agents",
  description:
    "An honest comparison. Every AI now has built-in memory and every one of them is a silo. Cloud assistants keep your mail on their servers. Server agents need a Linux box. MakoBot is one assistant on your own Windows PC that reads your mail, keeps your calendar, talks, listens, and remembers.",
  alternates: { canonical: "https://makobot.com/compare" },
};

export default function ComparePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Nav />

      {/* ─── HERO ─── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#0061aa] opacity-[0.07] blur-[120px] pointer-events-none" />

        <div className="mb-8">
          <Logo size={80} />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center max-w-4xl leading-tight mb-6">
          Honest comparison:{" "}
          <span className="gradient-text">where MakoBot fits</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#555555] text-center max-w-3xl mb-4 leading-relaxed">
          MakoBot is not a chatbot in a browser tab and not an agent on a
          rented server. She is an assistant on your own PC.
        </p>

        <p className="text-base text-[#777777] text-center max-w-2xl">
          Here is what the alternatives do well, where they overlap with her,
          and where she is genuinely different.
        </p>
      </section>

      {/* ─── THE THREE KINDS ─── */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <SectionHeading
          title="Three kinds of AI assistant"
          subtitle="And the one thing each of them asks you to give up."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-[#f8f9fb] rounded-xl border border-[#dbdbdb] p-6">
            <h3 className="text-lg font-semibold text-[#333333] mb-3">Cloud assistants</h3>
            <p className="text-sm text-[#555555] leading-relaxed mb-3">
              ChatGPT, Gemini, Copilot. Excellent models, always available, and
              each now remembers you a little.
            </p>
            <p className="text-sm text-[#0061aa] font-semibold">
              You give up: your mail and your memory live on their servers, and
              what one remembers never reaches the others.
            </p>
          </div>
          <div className="bg-[#f8f9fb] rounded-xl border border-[#dbdbdb] p-6">
            <h3 className="text-lg font-semibold text-[#333333] mb-3">Server agents</h3>
            <p className="text-sm text-[#555555] leading-relaxed mb-3">
              Open-source agents you run on a Linux box or a rented VPS and
              talk to through Telegram or Discord. Powerful and endlessly
              configurable.
            </p>
            <p className="text-sm text-[#0061aa] font-semibold">
              You give up: a weekend of setup, a server bill, and a chat app
              in the middle that can read the channel.
            </p>
          </div>
          <div className="bg-[#ffffff] rounded-xl border border-[#0061aa]/40 p-6">
            <h3 className="text-lg font-semibold text-[#333333] mb-3">MakoBot</h3>
            <p className="text-sm text-[#555555] leading-relaxed mb-3">
              One signed Windows app. Install it, add a mailbox or a project
              folder, and she is working. Her brain is Claude through your own
              plan. Her memory is files on your disk.
            </p>
            <p className="text-sm text-[#0061aa] font-semibold">
              You give up: Mac and Linux. She is Windows only.
            </p>
          </div>
        </div>
      </section>

      {/* ─── VENDOR MEMORY ─── */}
      <section className="px-6 py-16 bg-[#f8f9fb]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="Every AI has memory now"
            subtitle="Claude, ChatGPT, Gemini, Copilot, Cursor. All of them remember. Here is the honest difference."
          />

          <div className="bg-[#ffffff] rounded-xl border border-[#dbdbdb] p-6 sm:p-10">
            <p className="text-[#555555] text-base leading-relaxed mb-6">
              If you live in exactly one AI tool, its built-in memory may be
              enough. We will say that out loud. Four things are still true
              about every one of them.
            </p>
            <ul className="space-y-3 text-sm sm:text-base text-[#555555] leading-relaxed mb-6">
              <li>
                <span className="text-[#333333] font-semibold">They are silos.</span>{" "}
                What Claude remembers never reaches ChatGPT. The moment you use
                a second tool, your context splits.
              </li>
              <li>
                <span className="text-[#333333] font-semibold">They summarize.</span>{" "}
                A few dozen bullet points about you. MakoBot keeps every
                conversation, commit and decision in full, and searches all of it.
              </li>
              <li>
                <span className="text-[#333333] font-semibold">They live in a cloud.</span>{" "}
                Your accumulated context sits on the vendor&apos;s servers under
                their retention policy. MakoBot&apos;s memory is files on your disk.
              </li>
              <li>
                <span className="text-[#333333] font-semibold">They are not portable.</span>{" "}
                Leave the product, lose the memory. MakoBot&apos;s follows you to
                whatever tool you use next year.
              </li>
            </ul>
            <p className="text-[#0061aa] text-base font-semibold">
              Vendor memory is a retention feature for the vendor. MakoBot is a
              memory feature for you.
            </p>
          </div>
        </div>
      </section>

      {/* ─── TABLE ─── */}
      <section className="px-6 py-16 bg-[#f8f9fb]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Side by side"
            subtitle="What overlaps, what does not."
          />

          <div className="bg-[#f8f9fb] rounded-xl border border-[#dbdbdb] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#ffffff] text-[#333333]">
                    <th className="text-left py-4 px-4 font-semibold">Capability</th>
                    <th className="text-center py-4 px-3 font-semibold text-[#0061aa]">MakoBot</th>
                    <th className="text-center py-4 px-3 font-semibold">ChatGPT / Gemini<br />desktop</th>
                    <th className="text-center py-4 px-3 font-semibold">Microsoft<br />Copilot</th>
                    <th className="text-center py-4 px-3 font-semibold">Server agents<br />(Hermes, OpenClaw)</th>
                    <th className="text-center py-4 px-3 font-semibold">Memory tools<br />(OpenMemory, Pieces)</th>
                  </tr>
                </thead>
                <tbody>
                  <Row feature="Runs on your own PC, memory stored as files on your disk" cells={[true, false, false, "on your server", "partly"]} />
                  <Row feature="Watches your inbox across Outlook, Gmail, iCloud and Yahoo" cells={[true, false, "Outlook only", "with setup", false]} />
                  <Row feature="Tells forged mail from genuine mail using the sender's own authentication records" cells={[true, false, false, false, false]} />
                  <Row feature="Every send, reply, forward and delete waits for your approval, and no setting can turn that off" cells={[true, "n/a", "n/a", "configurable", "n/a"]} />
                  <Row feature="Calendar and to-do list inside the app" cells={[true, false, true, "with setup", false]} />
                  <Row feature="Voice that never leaves the machine (local speech recognition)" cells={[true, false, false, "with setup", false]} />
                  <Row feature="Reach it from your phone without a public server" cells={["Tailscale only", "their cloud", "their cloud", "Telegram / Discord", false]} />
                  <Row feature="Captures your ChatGPT, Claude.ai and Gemini web chats into one memory" cells={[true, false, false, false, false]} />
                  <Row feature="Briefs Claude Code automatically in every project" cells={[true, false, false, false, "with setup"]} />
                  <Row feature="Full conversation history kept, never summarized away" cells={[true, false, false, true, "varies"]} />
                  <Row feature="A second AI critiques the answer, with no tools and no ability to act" cells={[true, false, false, "multi-agent rooms", false]} />
                  <Row feature="Signed Windows installer with a verified updater" cells={[true, true, true, false, "varies"]} />
                  <Row feature="Setup time" cells={["minutes", "minutes", "minutes", "an afternoon", "an hour"]} />
                  <Row feature="Ongoing cost beyond your AI plan" cells={["none", "subscription", "subscription", "server bill", "varies"]} />
                  <Row feature="Mac and Linux" cells={[false, true, true, true, true]} />
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-[#999999] mt-4 text-center">
            Based on each product&apos;s public documentation, September 2026.
          </p>
        </div>
      </section>

      {/* ─── WHERE EACH WINS ─── */}
      <section className="px-6 py-16 max-w-6xl mx-auto w-full">
        <SectionHeading
          title="Where each one wins"
          subtitle="None of these are bad. They are aimed at different people."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon="globe"
            title="ChatGPT and Gemini desktop apps"
            description="The best models in a polished window, on every platform. If you want a chat window and nothing more, they are hard to beat. They do not read your mail, keep your calendar, or remember what you told a different tool."
          />
          <FeatureCard
            icon="building"
            title="Microsoft Copilot"
            description="If your whole life is in Microsoft 365 and you are happy for it to stay on Microsoft's servers, Copilot is deeply wired in. MakoBot uses the same Outlook, calendar and To Do accounts, but keeps the memory on your machine and also reads your Gmail."
          />
          <FeatureCard
            icon="cpu"
            title="Server agents (Hermes Agent, OpenClaw)"
            description="Open source, endlessly extensible, and they run anywhere from a five-dollar VPS to a GPU cluster. Superb for engineers who want to own every piece. They assume a terminal, a server, and a chat app in front. MakoBot borrows several of their best ideas and puts them behind one installer."
          />
          <FeatureCard
            icon="brain"
            title="Memory tools (OpenMemory, Pieces, Mem0)"
            description="Shared memory for your coding tools, some of it local and some cloud-assisted. Good at the one job. MakoBot does that job for Claude Code and any MCP client, and then also answers your mail and talks to you."
          />
        </div>
      </section>

      {/* ─── WHEN ─── */}
      <section className="px-6 py-16 bg-[#f8f9fb]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="When MakoBot is the right fit"
            subtitle="And when something else might be."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f8f9fb] rounded-xl border border-[#0061aa]/40 p-6">
              <div className="text-2xl mb-3">✓</div>
              <h3 className="text-lg font-semibold text-[#333333] mb-3">Pick MakoBot if…</h3>
              <ul className="space-y-3 text-sm text-[#555555] leading-relaxed">
                <li>You want one assistant that knows your mail, your calendar and your projects, and you want all of it on your own machine.</li>
                <li>You run Claude Code and are tired of re-explaining a project every session.</li>
                <li>You would rather talk than type, and you do not want your voice uploaded.</li>
                <li>You want a second AI to check an answer without giving it the keys.</li>
                <li>You are not a terminal person and want a real Windows app with an installer.</li>
                <li>You work on more than one computer and want the same memory on all of them without another account.</li>
              </ul>
            </div>

            <div className="bg-[#f8f9fb] rounded-xl border border-[#dbdbdb] p-6">
              <div className="text-2xl mb-3">→</div>
              <h3 className="text-lg font-semibold text-[#333333] mb-3">Pick something else if…</h3>
              <ul className="space-y-3 text-sm text-[#555555] leading-relaxed">
                <li>You use exactly one AI tool and its built-in memory feels like enough. Come back when you add a second.</li>
                <li>You want an agent on a server you can reach from Telegram or Discord, and you are comfortable running one. <span className="text-[#0061aa]">Hermes Agent</span> is the strongest of those.</li>
                <li>You only need shared memory for coding tools and nothing else. <span className="text-[#0061aa]">OpenMemory</span> is leaner.</li>
                <li>You are building a product that needs memory as an API. <span className="text-[#0061aa]">Mem0</span> or <span className="text-[#0061aa]">Letta</span>.</li>
                <li>You are on Mac or Linux. MakoBot is Windows for now.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Try her on your own setup
          </h2>
          <p className="text-[#555555] text-base mb-8">
            Free key, free download. Runs on your machine, on your Claude plan.
          </p>
          <a
            href="/get-key"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white font-semibold text-lg transition-colors"
          >
            Get Free Key + Download
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Row({
  feature,
  cells,
}: {
  feature: string;
  cells: (boolean | string)[];
}) {
  return (
    <tr className="border-b border-[#dbdbdb]/50 hover:bg-[#ffffff]/40">
      <td className="py-3 px-4 text-sm text-[#555555]">{feature}</td>
      {cells.map((v, i) => (
        <td key={i} className="py-3 px-3 text-center">
          {v === true ? (
            <span className="text-[#10B981] font-bold text-lg">✓</span>
          ) : v === false ? (
            <span className="text-[#999999] font-bold text-lg">✗</span>
          ) : (
            <span className="text-xs text-[#777777] italic">{v}</span>
          )}
        </td>
      ))}
    </tr>
  );
}
