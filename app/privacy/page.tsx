import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "../components";
import { PRIVACY_LAST_UPDATED } from "@/lib/version";

export const metadata: Metadata = {
  title: "Privacy Policy — MakoBot",
  description:
    "MakoBot privacy policy. Your mail, memory, transcripts and voice stay on your computer. What the app connects to, what the website and the Microsoft Store collect, how long we keep support tickets, and your rights.",
  alternates: { canonical: "https://makobot.com/privacy" },
};

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-[#333333] mb-3">{children}</h2>;
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <Logo size={48} />
          <h1 className="text-3xl font-bold mt-6 mb-2">Privacy Policy</h1>
          <p className="text-sm text-[#999999]">Last updated: {PRIVACY_LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-[#555555] text-base leading-relaxed">
          <section>
            <H>The short version</H>
            <p>
              MakoBot runs on your computer. Your mail, calendar, memory files, conversation transcripts and voice stay there. We do not receive them and
              could not read them if we wanted to. The app has no analytics or telemetry. The website collects an email address so we can issue a free
              license key, keeps a count of page views, and keeps the support messages you choose to send us. This policy covers the app whether you
              installed it from makobot.com or from the Microsoft Store, and it covers the website.
            </p>
          </section>

          <section>
            <H>What the app keeps, and where</H>
            <p>
              Everything MakoBot remembers is stored as plain files under your Windows profile: the memory folder inside your Local AppData folder, and
              settings, routines and the log inside your Roaming AppData folder. You can open, copy, back up or delete them at any time. Mailbox
              passwords and app passwords are encrypted with Windows Data Protection, tied to your Windows account, and are never logged, shown, or sent
              anywhere. API keys, tokens and similar secrets are scrubbed before anything is written to memory, saved to a transcript, or shown to a
              second AI. Speech recognition runs on your machine, so audio is never uploaded. Uninstalling leaves the data folder in place so nothing is
              lost by accident; delete it yourself to remove everything.
            </p>
          </section>

          <section>
            <H>What the app sends, and to whom</H>
            <p className="mb-3">The app makes a small number of outbound connections on its own. None of them carry your mail, memory or conversations.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="text-[#333333] font-medium">makobot.com</span>, to activate a license key (direct-download edition only) and, about once
                an hour, to ask whether the build you are running has been paused for a problem. That request carries the build number and your IP
                address, nothing else.
              </li>
              <li>
                <span className="text-[#333333] font-medium">GitHub</span>, to look for a newer signed release (direct-download edition only; the Store
                edition updates through the Microsoft Store).
              </li>
              <li>
                <span className="text-[#333333] font-medium">Microsoft&apos;s speech service</span>, to turn its replies into a spoken voice. The text of
                the reply is sent for that purpose only.
              </li>
              <li>
                <span className="text-[#333333] font-medium">Hugging Face</span>, once, to download the speech-recognition and search models that then run
                entirely on your machine.
              </li>
              <li>
                <span className="text-[#333333] font-medium">Anthropic</span>, which receives the conversations you have with the assistant, including the
                mail, calendar and memory it reads to answer you, under your own Claude plan and Anthropic&apos;s privacy policy. Mako Logics is not in
                the middle of that connection and does not see it.
              </li>
              <li>
                <span className="text-[#333333] font-medium">Your own mail, calendar and to-do providers</span>, using credentials you enter, to do what
                you asked.
              </li>
            </ul>
            <p className="mt-3">
              The app also listens on your computer&apos;s own loopback address so other programs on the same PC, such as Claude Code or a browser
              extension you install, can read its memory. That listener is protected by a token and is never reachable from the network. The optional
              phone page is served only on your own private Tailscale network.
            </p>
          </section>

          <section>
            <H>Things that only happen when you start them</H>
            <p>
              If you ask a second AI for an opinion, the recent conversation and its answer are sent to that provider with your own key, after secrets
              have been scrubbed, and only after you have ticked a one-time consent. If you ask for an image or a video, the prompt goes to the generation
              service with your own key. If you turn on sync between your computers, encrypted packets are written to a folder you choose; the passphrase
              never leaves your machine, so your storage provider sees only scrambled data. If you install the browser extension, it sends your ChatGPT,
              Claude.ai and Gemini web conversations to the app on the same computer, and nowhere else.
            </p>
          </section>

          <section>
            <H>Microphone and other Windows permissions</H>
            <p>
              The app asks Windows for the microphone only for voice input, and uses it only while you hold the talk button or have switched the wake
              phrase on. It does not record in the background. The Microsoft Store edition declares the microphone, internet, private network and
              full-trust capabilities because the app runs helper processes on your PC and keeps its files in the normal AppData folders where other
              programs can read them; that is how Claude Code and other tools reach its memory.
            </p>
          </section>

          <section>
            <H>The Microsoft Store</H>
            <p>
              If you install MakoBot from the Microsoft Store, Microsoft handles the download, installation and updates under the Microsoft Privacy
              Statement. Microsoft shows us aggregate, anonymous numbers about acquisitions, installs, crashes and ratings; it does not give us your name,
              email address or Microsoft account. The Store edition never contacts makobot.com for a license key and never creates a website account.
            </p>
          </section>

          <section>
            <H>What the website collects</H>
            <p>
              When you sign in with Google or GitHub to get a license key, we receive your name, email address and profile picture from that provider.
              We use them to create your key and to show you your own account. We record each download with the time, IP address and browser it came
              from, and we keep basic page-view counts (page, referrer, IP address) in our own database. We use Vercel&apos;s analytics for page
              performance, which does not set cookies or identify you. We do not use advertising trackers and we do not sell or share any of this.
            </p>
          </section>

          <section>
            <H>Support chat, contact page and tickets</H>
            <p>
              The Help chat in the corner of the site answers from the text on this site. Each question you type, with the last few messages of that
              chat, is sent to Fireworks AI, the company that runs the open-weight model behind it, to produce the answer; Fireworks does not train on it
              and we do not store it. Nothing from the chat is kept until you choose &ldquo;Talk to a person&rdquo;. Then your email address, your message
              and the chat so far are saved as a support ticket in our database, emailed to us, and answered by a person from support@makobot.com.
              Messages sent through the contact page or by email become tickets the same way. We keep the first three parts of your IP address with a
              ticket to tell one visitor from many; never the whole address. Tickets are kept for up to two years so we can follow up on a repeat problem,
              then deleted. Write to support@makobot.com if you want one deleted sooner. The forms use Cloudflare Turnstile to tell people from bots,
              under Cloudflare&apos;s privacy policy.
            </p>
          </section>

          <section>
            <H>How we protect it</H>
            <p>
              The website runs on Vercel with its database on Supabase, both in the United States, over encrypted connections, with access limited to
              Mako Logics staff. Support email is sent through Cloudflare. The app&apos;s installer and every update are digitally signed by Mako Logics
              LLC, and the app refuses an update signed by anyone else. No system is perfectly secure; if we learn of a breach affecting your information
              we will tell you as the law requires.
            </p>
          </section>

          <section>
            <H>Your choices and rights</H>
            <ul className="list-disc list-inside space-y-2">
              <li>Ask us to delete your website account, your key, or your support tickets. We remove them within 30 days.</li>
              <li>Ask us what we hold about you and we will send it to the email address on the account.</li>
              <li>Uninstall the app and delete its data folder to remove everything it stored on your computer.</li>
              <li>Turn off the voice, the second-opinion feature, sync, the phone page or any mailbox in Settings, and that connection stops.</li>
              <li>
                We do not sell personal information and we do not share it for cross-context advertising, so there is nothing to opt out of. Residents
                of California and other states with privacy laws may exercise the rights above by writing to support@makobot.com; we will not treat you
                differently for doing so.
              </li>
            </ul>
          </section>

          <section>
            <H>Children</H>
            <p>
              MakoBot and makobot.com are not directed at children under 13, and the app is intended for adults. We do not knowingly collect information
              from children. If you believe a child has given us information, write to support@makobot.com and we will delete it.
            </p>
          </section>

          <section>
            <H>Changes</H>
            <p>
              We may update this policy. The date at the top changes when we do, and a material change is noted on makobot.com. The current version always
              lives at makobot.com/privacy.
            </p>
          </section>

          <section>
            <H>Contact</H>
            <p>
              Mako Logics LLC, Montgomery, Texas
              <br />
              Support: support@makobot.com, or <Link href="/contact" className="text-[#0061aa] hover:text-[#004d88]">makobot.com/contact</Link>
              <br />
              Email: admin@makobot.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-[#dbdbdb]/30">
          <Link href="/" className="text-sm text-[#999999] hover:text-[#777777]">
            &larr; Back to makobot.com
          </Link>
        </div>
      </div>
    </div>
  );
}
