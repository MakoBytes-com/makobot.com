import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "../components";
import { TERMS_LAST_UPDATED } from "@/lib/version";

export const metadata: Metadata = {
  title: "Terms of Service — MakoBot",
  description:
    "The terms for using MakoBot, whether installed from makobot.com or the Microsoft Store, and for using makobot.com. Free license, your own accounts and Claude plan, software provided as is, Texas law.",
  alternates: { canonical: "https://makobot.com/terms" },
};

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-[#333333] mb-3">{children}</h2>;
}

export default function TermsPage() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <Logo size={48} />
          <h1 className="text-3xl font-bold mt-6 mb-2">Terms of Service</h1>
          <p className="text-sm text-[#999999]">Last updated: {TERMS_LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-[#555555] text-base leading-relaxed">
          <section>
            <H>Who these terms are between</H>
            <p>
              These terms are an agreement between you and Mako Logics LLC, a Texas limited liability company (&ldquo;Mako Logics&rdquo;, &ldquo;we&rdquo;).
              They cover the MakoBot desktop application (&ldquo;MakoBot&rdquo; or &ldquo;the app&rdquo;), however you obtained it, and the website
              makobot.com. By installing or using the app, or by using the website, you agree to them. If you do not agree, do not install or use the
              app and do not use the website.
            </p>
            <p className="mt-3">
              You must be at least 18 years old, or the age of majority where you live, to use MakoBot. The app reads and can act on your email and
              calendar, and it is not intended for minors.
            </p>
          </section>

          <section>
            <H>Two ways to get the app</H>
            <p>
              MakoBot is offered as a direct download from makobot.com and through the Microsoft Store. It is the same app. The direct download uses a
              free license key issued at makobot.com and updates itself with releases digitally signed by Mako Logics. The Microsoft Store edition
              installs and updates through the Store, needs no key, and does not add itself to Windows startup. Everything else, including where your
              data lives, is the same in both.
            </p>
            <p className="mt-3">
              If you obtained MakoBot from the Microsoft Store, these terms govern your use of the app instead of Microsoft&apos;s Standard Application
              License Terms, to the extent Microsoft permits a publisher to supply its own terms. Microsoft&apos;s own terms and privacy statement govern
              the Store itself, your Microsoft account, and any Store transaction. Microsoft is not a party to this agreement, does not provide support
              for MakoBot, and has no responsibility for the app, its content, or these terms. Microsoft and its subsidiaries are third-party
              beneficiaries of this section and of the sections on warranties and liability below, and may enforce them against you.
            </p>
          </section>

          <section>
            <H>License</H>
            <p>
              Mako Logics grants you a personal, non-exclusive, non-transferable, revocable license to install and use MakoBot on Windows computers you
              own or control, for your own personal or internal business use. You may not sell, rent, sublicense, or redistribute the app; remove or
              alter its notices or signatures; or reverse engineer, decompile, or disassemble it except where the law expressly allows it despite this
              term. MakoBot includes open-source components that remain under their own licenses; nothing here restricts the rights those licenses give
              you in those components. MakoBot, the MakoBot logo, MakoBytes, and Mako Logics are trademarks of Mako Logics LLC.
            </p>
          </section>

          <section>
            <H>License keys (direct download)</H>
            <p>
              A license key from makobot.com is free and is personal to the Google or GitHub account that generated it. You may use your key on more than
              one computer you own. Keys may not be shared, sold, published, or transferred. We may revoke a key that is misused, and we may retire the
              key system with notice on makobot.com. A key is not needed for the Microsoft Store edition.
            </p>
          </section>

          <section>
            <H>What you need to bring</H>
            <p>
              MakoBot&apos;s assistant runs on Claude, a service of Anthropic. To get answers you sign in with your own Claude subscription inside the
              app. Mako Logics does not sell, resell, or include a Claude subscription, and your use of Claude is governed by Anthropic&apos;s terms and
              your agreement with them. Mail, calendar, and to-do features use your own Microsoft, Google, Apple, or Yahoo accounts under those
              providers&apos; terms. Optional features that call other AI, speech, image, or network services use keys or accounts you supply. We are not
              responsible for those services, their availability, their charges, or what they do with data you send them.
            </p>
          </section>

          <section>
            <H>What the assistant produces</H>
            <p>
              MakoBot&apos;s replies, summaries, drafts, briefings, and judgements (for example, whether an email looks genuine) are generated by an AI
              model. They can be wrong, incomplete, or out of date. They are not legal, financial, medical, or professional advice. You are responsible for
              reviewing anything the assistant produces before you rely on it or send it. Every email send, reply, forward, and delete waits for your
              approval; once you approve, the message is yours, sent from your account, and you are responsible for it.
            </p>
          </section>

          <section>
            <H>Acceptable use</H>
            <p>You agree not to use MakoBot or makobot.com to:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>break any law, including laws on unsolicited email, harassment, privacy, and unauthorized access to accounts or systems;</li>
              <li>access a mailbox, calendar, or account that you are not authorized to use;</li>
              <li>send spam, deceptive mail, or malware, or impersonate another person or organization;</li>
              <li>interfere with the app&apos;s safety features, its signature checks, or the makobot.com service; or</li>
              <li>probe, scrape, overload, or attack makobot.com or the support tools on it.</li>
            </ul>
          </section>

          <section>
            <H>Your data and your backups</H>
            <p>
              MakoBot stores its memory, transcripts, settings, and encrypted mail credentials on your computer, not on our servers. That means we cannot
              recover them for you. You are responsible for backing up your own data. Uninstalling the app leaves its data folder in place on purpose;
              delete it yourself if you want it gone. The Privacy Policy describes exactly what the app and the website send and keep.
            </p>
          </section>

          <section>
            <H>Updates, changes, and the pause switch</H>
            <p>
              We may release updates, change or remove features, and stop distributing MakoBot at any time. The Store edition updates through the
              Microsoft Store; the direct edition checks for and installs releases signed by Mako Logics. The app also checks makobot.com about once an
              hour for a signal that lets us pause unattended background work on a specific build if it is found to misbehave. That switch can only pause
              background routines; it cannot read your data or stop you from using the app, and if makobot.com cannot be reached the app carries on
              normally.
            </p>
          </section>

          <section>
            <H>The website, support, and what you send us</H>
            <p>
              Signing in at makobot.com creates an account tied to your Google or GitHub identity. You are responsible for that identity. When you use
              the Help chat, the contact page, or email support, the messages you send become part of a support ticket that we may keep, read, and use to
              answer you and to improve the app and its documentation. Do not send us passwords, license keys for other software, or anyone else&apos;s
              personal information.
            </p>
          </section>

          <section>
            <H>No warranty</H>
            <p>
              MAKOBOT AND MAKOBOT.COM ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;, WITHOUT WARRANTY OF ANY KIND. TO THE FULLEST EXTENT
              PERMITTED BY LAW, MAKO LOGICS DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              TITLE, AND NON-INFRINGEMENT, AND ANY WARRANTY THAT THE APP WILL BE ERROR-FREE, UNINTERRUPTED, OR THAT AI OUTPUT WILL BE ACCURATE. SOME
              STATES DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES, SO PARTS OF THIS SECTION MAY NOT APPLY TO YOU.
            </p>
          </section>

          <section>
            <H>Limitation of liability</H>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, MAKO LOGICS AND ITS MEMBERS, EMPLOYEES, AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF DATA, EMAIL, PROFITS, OR BUSINESS, ARISING OUT OF OR RELATED
              TO THE APP, THE WEBSITE, OR THESE TERMS, HOWEVER CAUSED. OUR TOTAL LIABILITY FOR ALL CLAIMS WILL NOT EXCEED THE GREATER OF THE AMOUNT YOU
              PAID US FOR MAKOBOT IN THE TWELVE MONTHS BEFORE THE CLAIM OR TEN US DOLLARS. THESE LIMITS APPLY EVEN IF A REMEDY FAILS OF ITS ESSENTIAL
              PURPOSE.
            </p>
          </section>

          <section>
            <H>Indemnity</H>
            <p>
              You will defend and hold harmless Mako Logics from claims, damages, and costs, including reasonable attorneys&apos; fees, that arise from
              your use of the app or website in violation of these terms or the law, from messages you approve and send, or from your use of third-party
              services through the app.
            </p>
          </section>

          <section>
            <H>Termination</H>
            <p>
              You may stop using MakoBot at any time by uninstalling it. We may suspend or end your license, your website account, or your key if you
              breach these terms. The sections on warranties, liability, indemnity, and governing law survive termination.
            </p>
          </section>

          <section>
            <H>Export and government use</H>
            <p>
              You agree to comply with United States export laws and will not use or export MakoBot where that is prohibited. The app is commercial
              computer software; any use by the US government is subject to these terms.
            </p>
          </section>

          <section>
            <H>Governing law and disputes</H>
            <p>
              These terms are governed by the laws of the State of Texas, without regard to its conflict-of-law rules. Any dispute that cannot be
              resolved by contacting us first will be brought in the state or federal courts located in Montgomery County, Texas, and you consent to
              their jurisdiction. If any part of these terms is found unenforceable, the rest remains in effect. These terms are the entire agreement
              between you and Mako Logics about MakoBot and makobot.com.
            </p>
          </section>

          <section>
            <H>Changes to these terms</H>
            <p>
              We may update these terms. The date at the top changes when we do, and material changes are noted on makobot.com. Continued use of the app
              or website after a change means you accept the new terms.
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
