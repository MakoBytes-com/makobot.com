"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "../components";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👤" },
  { href: "/admin/keys", label: "Keys", icon: "🔑" },
  { href: "/admin/versions", label: "Versions", icon: "🛑" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/exchange", label: "Exchange", icon: "🔄" },
  { href: "/admin/services", label: "Services", icon: "🔗" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#777777]">Loading...</p>
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Logo size={64} />
        <h1 className="text-2xl font-bold mt-6 mb-2">Admin Access Required</h1>
        <p className="text-[#777777] text-center max-w-md">
          You need admin privileges to access this page. Sign in with an admin account or contact the site owner.
        </p>
        <a href="/" className="mt-6 text-sm text-[#0061aa] hover:text-[#004d88]">
          &larr; Back to makobot.com
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f8f9fb] border-r border-[#dbdbdb] flex flex-col">
        <div className="p-5 border-b border-[#dbdbdb]">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <p className="text-sm font-bold text-[#333333]">MakoBot</p>
              <p className="text-xs text-[#999999]">Admin Dashboard</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm transition-colors ${
                  active
                    ? "bg-[#0061aa]/10 text-[#0061aa] font-medium"
                    : "text-[#777777] hover:bg-[#dbdbdb]/50 hover:text-[#333333]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#dbdbdb]">
          <div className="flex items-center gap-3">
            {session.user.image && (
              <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#333333] truncate">{session.user.name}</p>
              <p className="text-xs text-[#999999] truncate">{session.user.email}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <a href="/" className="text-xs text-[#999999] hover:text-[#0061aa] transition-colors">
              &larr; Main Site
            </a>
            <a href="/exchange" className="text-xs text-[#999999] hover:text-[#0061aa] transition-colors">
              Exchange
            </a>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-xs text-[#999999] hover:text-[#DC2626] transition-colors ml-auto">
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
