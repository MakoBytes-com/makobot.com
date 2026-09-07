import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "../components";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ask a question, report a bug, or tell us what would make MakoBot better. A person at Mako Logics replies by email, usually the same day.",
  alternates: { canonical: "https://makobot.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Logo size={48} />
          <h1 className="text-3xl font-bold mt-6 mb-3">Contact</h1>
          <p className="text-[#555555] text-base leading-relaxed max-w-2xl">
            Ask a question, report a bug, or tell us what would make MakoBot better. Every message goes into our support queue and a person replies by email,
            usually the same day. If you are writing about a problem, the build number at the bottom of the app&rsquo;s Settings and the last lines of its log
            help a lot.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_260px]">
          <ContactForm />

          <aside className="text-sm text-[#555555] leading-relaxed space-y-6">
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#777777] mb-2">Email</h2>
              <a href="mailto:support@makobot.com" className="text-[#0061aa] hover:text-[#004d88] font-medium">
                support@makobot.com
              </a>
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#777777] mb-2">Quick answers</h2>
              <p>
                The Help bubble in the corner of every page answers most questions about the free key, installing, and connecting mail right away. If it
                cannot, it passes you to a person from there.
              </p>
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#777777] mb-2">Where the log is</h2>
              <p>
                Paste <code className="text-[13px] bg-[#f1f5f9] px-1.5 py-0.5 rounded">%APPDATA%\MakoBot</code> into the File Explorer address bar. The file is
                makobot-shell.log.
              </p>
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#777777] mb-2">Company</h2>
              <p>
                Mako Logics LLC
                <br />
                Montgomery, Texas
              </p>
            </div>
          </aside>
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
