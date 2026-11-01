"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Logo } from "../components";
import NotifySignup from "../notify-signup";
import { OFFLINE_HEADING, OFFLINE_BODY } from "@/lib/offline";

/**
 * MakoBot is offline (lib/offline.ts, 2026-11-01): no keys are handed out and
 * nothing downloads, so this page is the waitlist signup. It must still offer
 * sign-in, because it is NextAuth's sign-in page (lib/auth.ts) and the only
 * way into /admin. The key-and-download flow it used to carry is in git
 * history (before this commit) for the relaunch.
 */
export default function GetKeyPage() {
  const { data: session, status } = useSession();

  // NextAuth sends people here with ?callbackUrl=/admin; send them back there.
  function signInWith(provider: "google" | "github") {
    const cb = new URLSearchParams(window.location.search).get("callbackUrl");
    const safe = cb && cb.startsWith("/") && !cb.startsWith("//") ? cb : "/get-key";
    signIn(provider, { redirectTo: safe });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#0061aa] opacity-[0.05] blur-[120px] pointer-events-none" />

      <Logo size={80} />
      <h1 className="text-3xl sm:text-4xl font-bold mt-8 mb-3 text-center">{OFFLINE_HEADING}</h1>
      <p className="text-[#555555] text-center max-w-md mb-10 leading-relaxed">{OFFLINE_BODY}</p>

      <div className="bg-[#f8f9fb] rounded-xl p-8 border border-[#dbdbdb] w-full max-w-lg flex justify-center">
        <NotifySignup source="get-key" />
      </div>

      {status !== "loading" && (
        <div className="mt-8 text-sm text-[#7a8aa0] text-center">
          {session?.user ? (
            session.user.isAdmin ? (
              <Link href="/admin" className="underline hover:no-underline text-[#0061aa]">
                Go to admin
              </Link>
            ) : (
              <span>Signed in as {session.user.email}</span>
            )
          ) : (
            <span>
              Site admin? Sign in with{" "}
              <button type="button" onClick={() => signInWith("google")} className="underline hover:no-underline">
                Google
              </button>{" "}
              or{" "}
              <button type="button" onClick={() => signInWith("github")} className="underline hover:no-underline">
                GitHub
              </button>
              .
            </span>
          )}
        </div>
      )}

      <Link href="/" className="mt-6 text-sm text-[#999999] hover:text-[#777777] transition-colors">
        &larr; Back to makobot.com
      </Link>
    </div>
  );
}
