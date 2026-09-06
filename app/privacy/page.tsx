import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "../components";
import { PRIVACY_LAST_UPDATED } from "@/lib/version";

export const metadata: Metadata = {
  title: "Privacy Policy — MakoBot",
  description:
    "MakoBot privacy policy. Your mail, memory, transcripts and voice stay on your computer. The app contacts our server only to activate a key and check service status. The website collects an email address to issue a free key.",
  alternates: { canonical: "https://makobot.com/privacy" },
};

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
            <h2 className="text-xl font-semibold text-[#333333] mb-3">The short version</h2>
            <p>
              MakoBot runs on your computer. Your mail, calendar, memory files,
              conversation transcripts and voice recordings stay there. We do
              not receive them and we could not read them if we wanted to. The
              website collects an email address so we can issue you a free
              license key, and keeps a count of page views.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#333333] mb-3">What the website collects</h2>
            <p>
              When you sign in with Google or GitHub to get a license key, we
              receive your name, email address and profile picture from that
              provider. We use them to create your key and to show you your own
              account. We record each download with the time, IP address and
              browser it came from, and we keep basic page-view counts (page,
              referrer, IP address) in our own database. We do not use
              advertising trackers and we do not sell or share any of this.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#333333] mb-3">What the desktop app sends, and to whom</h2>
            <p className="mb-3">
              The app makes a small number of outbound connections on its own.
              None of them carry your mail, memory or conversations.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="text-[#333333] font-medium">makobot.com</span>, to
                activate your license key and, about once an hour, to check
                whether the build you are running has been paused for a problem.
              </li>
              <li>
                <span className="text-[#333333] font-medium">GitHub</span>, to look
                for a newer signed release.
              </li>
              <li>
                <span className="text-[#333333] font-medium">Microsoft&apos;s speech service</span>,
                to turn its replies into a spoken voice. The text of the reply
                is sent for that purpose only.
              </li>
              <li>
                <span className="text-[#333333] font-medium">Hugging Face</span>, once,
                to download the speech-recognition and search models that then
                run entirely on your machine.
              </li>
              <li>
                <span className="text-[#333333] font-medium">Your own mail, calendar and AI providers</span>,
                using credentials you enter, to do what you asked. Anthropic
                receives the conversations you have with it, under your own
                Claude plan and Anthropic&apos;s terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#333333] mb-3">Things that only happen when you start them</h2>
            <p>
              If you ask a second AI for an opinion, the recent conversation and
              its answer are sent to that provider with your own key, after
              secrets have been scrubbed, and only after you have ticked a
              one-time consent. If you ask for an image or a video, the prompt
              goes to the generation service with your own key. If you turn on
              sync between your computers, encrypted packets are written to a
              folder you choose. The passphrase never leaves your machine, so
              your storage provider sees only scrambled data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#333333] mb-3">What stays on your computer</h2>
            <p>
              Mailbox passwords are encrypted with Windows Data Protection and
              are never logged or shown. Everything it remembers is stored as
              plain files under your Windows profile, and you can open, copy,
              back up or delete them at any time. Speech recognition runs
              locally, so audio is never uploaded. There is no usage analytics
              or telemetry in the app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#333333] mb-3">Your choices</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Ask us to delete your website account and key. We remove it within 30 days.</li>
              <li>Uninstall the app and delete its data folder to remove everything it stored.</li>
              <li>Turn off the voice, the second-opinion feature, sync or any mailbox in Settings, and that connection stops.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#333333] mb-3">Children</h2>
            <p>
              MakoBot is not directed at children under 13 and we do not
              knowingly collect information from them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#333333] mb-3">Contact</h2>
            <p>
              Mako Logics LLC<br />
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
