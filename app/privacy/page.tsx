import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "../components";
import { PRIVACY_LAST_UPDATED } from "@/lib/version";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "MakoBot privacy policy. Your files, mailbox passwords and voice recordings stay on your computer; what the assistant reads to answer you goes to Anthropic under your own Anthropic API key. What the app connects to, what the website and the Microsoft Store collect, how long we keep things, and your rights.",
  alternates: { canonical: "https://www.makobot.com/privacy" },
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
              MakoBot runs on your computer. Your files, mailbox passwords and voice recordings stay there. Text the assistant reads or writes for
              you (your chats, and any mail, calendar or memory it looks at to answer) is sent to Anthropic, under your own Anthropic API key, so Claude can
              answer. Mako Logics never receives any of it and could not read it if we wanted to. The app sends us no analytics or telemetry. The
              website collects an email address so we can issue a free license key, keeps a count of page views, and keeps the support messages you
              choose to send us. This policy covers the app whether you installed it from makobot.com or from the Microsoft Store, and it covers the
              website.
            </p>
          </section>

          <section>
            <H>What the app keeps, and where</H>
            <p>
              Everything MakoBot remembers is stored as plain files under your Windows profile, in its folders inside your Local and Roaming AppData
              folders. You can open, copy, back up or delete them at any time. Mailbox
              passwords and app passwords are encrypted with Windows Data Protection, tied to your Windows account, are never logged or shown, and are
              used only to sign in to your own mail provider. The local access key that lets Claude Code and other tools on this PC read MakoBot&apos;s
              memory is kept as a file only your Windows account can read, and your Claude sign-in is kept by Claude Code itself, in the .claude
              folder in your user folder. It also keeps a copy of the conversations Claude Code saves on this computer, so it remembers your work there too. API keys,
              tokens and similar secrets are scrubbed from memory notes, from those copied transcripts and from its activity log; your own chats with
              MakoBot are kept exactly as you typed them, in the conversations folder, except that any names you list under &ldquo;Names never to
              save&rdquo; in Settings are replaced wherever MakoBot saves text. If a file in a cloud folder MakoBot reads (a sync or sharing folder) is
              online-only, your sync provider downloads it so MakoBot can read it. When it
              looks at your screen (because you asked, or, if you chose &ldquo;Let it work on its own&rdquo;, because it decided to), it saves a
              picture of each monitor in your Pictures\MakoBot\screen folder and sends it to Anthropic. Speech recognition runs on your machine, so
              audio is never uploaded. Backups go to MakoBot&apos;s own data folder unless you choose another folder in Settings, and older copies are
              kept for up to a year (daily, weekly and monthly); they are plain files unless you set a backup passphrase, and if you choose a
              cloud-synced folder, that provider holds a copy. When you add a project, MakoBot adds (or refreshes) a &ldquo;makobot&rdquo; entry in
              that project&apos;s .mcp.json file, and in .cursor/mcp.json where you use Cursor, so those tools can reach its memory; it adds those file
              names to the project&apos;s .gitignore so the local access key is never committed; and it refreshes the key in its own entry in Cursor,
              Gemini CLI or Windsurf settings you already have. MakoBot keeps a count of which of its screens you open, on your computer only, and never
              sends it anywhere. If you press &ldquo;Find it in my projects&rdquo; in Settings, MakoBot looks for a
              CrazyRouter key in the .env.local file of the projects it watches and copies that one key into its own encrypted store; you can remove
              it in Settings. It never looks there unless you ask. Your own Claude Code hooks run only if you switch that on. Removing a conversation
              in the app moves it to a &ldquo;deleted&rdquo; folder inside the data folder, so it can be brought back; delete that file by hand to
              erase it. Uninstalling leaves your data in place so nothing is lost by accident (the downloaded installer offers to delete it). To remove
              everything, delete MakoBot&apos;s folders in your Local and Roaming AppData folders and in Pictures, the &ldquo;makobot&rdquo; entries it
              added to your projects&apos; .mcp.json files, and the entries starting with ms-365-mcp-server in Windows Credential Manager (your Microsoft
              mailbox sign-ins).
            </p>
          </section>

          <section>
            <H>What the app sends, and to whom</H>
            <p className="mb-3">
              The app makes a small number of outbound connections on its own. Apart from the voice, described below, none of them carry your mail,
              memory or conversations.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="text-[#333333] font-medium">makobot.com</span>, to activate a license key and re-check it about once a day if you have
                entered one (direct-download edition only), and, about once an hour, to ask whether the build you are running has been paused for a
                problem. That request carries the build number and your IP
                address, nothing else.
              </li>
              <li>
                <span className="text-[#333333] font-medium">GitHub</span>, to look for a newer signed release (direct-download edition only; the Store
                edition updates through the Microsoft Store).
              </li>
              <li>
                <span className="text-[#333333] font-medium">Microsoft&apos;s speech service</span>, to turn what it says into a spoken voice. The text
                being spoken is sent for that purpose only: anything it reads aloud, which is its replies, spoken routine briefings, and, if you have
                spoken email alerts on, the short summary of each alert (who it is from and why it matters). The voice starts switched off; nothing is
                sent until you turn it on, and nothing once you turn it off again.
              </li>
              <li>
                <span className="text-[#333333] font-medium">Hugging Face</span>, to download the speech-recognition and search models that then run
                entirely on your machine: the search model the first time there is memory to search, the speech model the first time you use the
                microphone. The spell checker&apos;s dictionary for your Windows language is likewise downloaded once, from Google.
              </li>
              <li>
                <span className="text-[#333333] font-medium">Anthropic</span>, which receives the conversations you have with the assistant, including the
                mail, calendar and memory it reads to answer you, under your own Anthropic API key and Anthropic&apos;s privacy policy. MakoBot also runs a few
                jobs on its own over the same connection: a short review after a chat goes quiet, to save what is worth remembering; a daily look back
                over its own notes and activity log (including notes from your other computers if you use a shared memory folder), which you can switch
                off in Settings; and a daily check on itself. If you switch on inbox watching or accept a routine that reads mail, the mail it reads to
                decide what matters goes too. Mako Logics is not in the middle of that connection and does not see it.
              </li>
              <li>
                <span className="text-[#333333] font-medium">Web pages</span>, when the assistant looks something up or you ask it to open a page:
                your computer requests that page, and what it found goes to Anthropic as part of the conversation.
              </li>
              <li>
                <span className="text-[#333333] font-medium">Your own mail, calendar and to-do providers</span>, using credentials you enter, to do what
                you asked. To reach a Microsoft mailbox the app uses an open-source helper that ships inside it.
              </li>
            </ul>
            <p className="mt-3">
              The app also listens on your computer&apos;s own loopback address so other programs on the same PC, such as Claude Code or a browser
              extension you install, can read its memory. That listener is protected by a token and is never reachable from the network. The optional
              phone page is served only on your own private Tailscale network, and switching it on asks Tailscale for a security certificate, which
              makes your computer&apos;s Tailscale name visible in public certificate logs. (An instant-mail relay for Microsoft 365 exists that only a
              hand-placed setup file can switch on; it uses Tailscale Funnel to receive Microsoft&apos;s new-mail signals at one web address. A normal
              install never has it.) If you pair a phone for notifications, each alert travels to your
              phone through its maker&apos;s push service (Apple, Google, Microsoft or Mozilla), encrypted so that service cannot read it. By default
              the notification says only that something needs you; who it is from and a one-line summary are included only if you turn that on in
              Settings, because a lock screen can be read by anyone holding the phone.
            </p>
          </section>

          <section>
            <H>Things that only happen when you start them</H>
            <p>
              If you ask a second AI for an opinion, the recent conversation and its answer are sent to that provider with your own key, and only after
              you have ticked a one-time consent. Keys and tokens in the earlier conversation are removed first, and if your question or the answer
              itself contains one, MakoBot refuses to send it. If you ask for an image or a video, the prompt goes to CrazyRouter,
              the generation service, with your own key, along with any picture you give it to work from. When you save or test a key, MakoBot sends
              that provider a one-word test question (or, for Brave Search, a one-word search) to check the key works; nothing of yours goes with it.
              When you add a mailbox, MakoBot signs in to its sending server to check replies will work, and sends nothing. If you turn on sync between your computers,
              encrypted packets are written to a folder or a database of your own that you choose; the passphrase never leaves your machine, so your
              storage provider sees only scrambled data. If you choose a shared memory folder instead, a plain copy of your memory is written there so your other computers can
              read it, with this computer&apos;s name and a random ID that tells your computers apart, so pick a folder only you can reach. If you install the browser extension, it sends your ChatGPT, Claude.ai and Gemini web
              conversations to the app on the same computer, and nowhere else. If you switch on the site checks or Night Shift, the app uses the GitHub
              and Vercel sign-ins already on your computer to read your own repositories and deployments, and visits your own sites. If you install a
              connector, it is downloaded from the npm registry (or, for GitHub, reached on GitHub&apos;s own server) and talks to the service it is
              for, with the details you give it.
            </p>
          </section>

          <section>
            <H>Microphone and other Windows permissions</H>
            <p>
              The app asks Windows for the microphone only for voice input, and uses it only while you hold the talk button, have the Listen switch
              on, have switched the wake phrase on, or (if you turn on &ldquo;talk over a spoken reply&rdquo;) while a reply is being spoken, just to
              hear that you started talking. It does not record in the background. The Microsoft Store edition declares the microphone, internet, private network,
              full-trust and unvirtualized-file-access capabilities because the app runs helper processes on your PC and keeps its files in the normal
              AppData folders where other programs can read them; that is how Claude Code and other tools reach its memory. It also declares an
              optional start-with-Windows task, which is off until you turn it on in Windows Settings.
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
              from, and we keep basic page-view counts (page, referrer, IP address) in our own database. When the app checks a license key we record
              the time, the build number, a shortened form of the key and the IP address. We use Vercel&apos;s analytics for page performance, which
              does not set cookies or identify you. Signing in sets one cookie that keeps you signed in; there are no other cookies. We do not track you
              across other sites, so we do not respond to Do Not Track signals differently. We do not use advertising trackers and we do not sell or
              share any of this.
            </p>
            <p className="mt-3">
              In short, the categories we hold are: identifiers (name, email address, profile picture, license key, IP address), internet activity on
              this site (downloads, page views, browser), and what you write to support. They come from you, your sign-in provider and your browser, and
              we use them only to issue and check keys, run and secure the site, and answer you. Account details are kept while your account exists;
              download, page-view and key-check records are kept for site statistics until you ask us to delete yours; support tickets are kept for up
              to two years.
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
              <li>
                Ask us to delete your website account, your key, or your support tickets. We remove them within 30 days; deleting your account also
                deletes your tickets and removes your IP address and browser from our download and key-check records.
              </li>
              <li>Ask us what we hold about you and we will send it to the email address on the account.</li>
              <li>Ask us to correct anything we hold about you that is wrong.</li>
              <li>Uninstall the app and delete what it stored, as listed under &ldquo;What the app keeps, and where&rdquo; above.</li>
              <li>Turn off the voice, the second-opinion feature, sync, the phone page or any mailbox in Settings, and that connection stops.</li>
              <li>
                We do not sell personal information and we do not share it for cross-context advertising, so there is nothing to opt out of. Residents
                of California and other states with privacy laws may exercise the rights above by writing to support@makobot.com, or through an
                authorized agent with your written permission. We confirm the request comes from the account&apos;s email address, answer within 45 days,
                and will not treat you differently for asking.
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
