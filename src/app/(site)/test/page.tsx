"use client";

import { useState } from "react";
import Link from "next/link";
import LoadingScreen from "@/components/loading/LoadingScreen";

const links = [
  { title: "Home", href: "/" },
  { title: "Admin", href: "/admin" },
  { title: "Admin Users", href: "/admin/users" },
  { title: "Admin User", href: "/admin/user" },
  { title: "Check", href: "/check" },
  { title: "Support", href: "/support" },
  { title: "Updates", href: "/updates" },
  { title: "Login", href: "/login" },
  { title: "Logout", href: "/logout" },
  { title: "Maintenance", href: "/maintenance" }
];

export default function TestPage() {
  const [showLoading, setShowLoading] = useState(false);

  if (showLoading) {
    return (
      <LoadingScreen
        onFinished={() => setShowLoading(false)}
        systemName="TEST_LOADING"
      />
    );
  }

  return (
    <main className="relative min-h-screen bg-[#05050a] text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.18),transparent_60%)] opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:120px_120px]" />
        <div className="absolute left-[-10%] right-[-10%] bottom-[15%] h-[220px] bg-gradient-to-r from-transparent via-purple-500/25 to-transparent blur-[30px] opacity-60" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-24 pb-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[10px] tracking-[0.45em] uppercase text-white/40">Test Hub</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
              System <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-purple-400">Pages</span>
            </h1>
            <p className="mt-3 text-sm text-white/60 max-w-xl">
              หน้านี้รวมลิงก์สำหรับทดสอบทุกหน้า รองรับทุกขนาดหน้าจอ
            </p>
          </div>
          <div className="border border-white/10 bg-white/5 px-4 py-3 text-[10px] tracking-[0.35em] uppercase text-white/50">
            Build: Test Route
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowLoading(true)}
            className="border border-cyan-400/40 bg-cyan-500/10 px-5 py-3 text-[10px] tracking-[0.35em] uppercase text-cyan-200 hover:bg-cyan-500/20 transition-all"
          >
            Test Loading Screen
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group border border-white/10 bg-white/5 px-5 py-5 rounded-2xl transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/10"
            >
              <div className="text-[9px] tracking-[0.4em] uppercase text-white/40">Navigate</div>
              <div className="mt-3 text-xl font-black uppercase text-white group-hover:text-cyan-200">
                {item.title}
              </div>
              <div className="mt-2 text-[10px] tracking-[0.3em] uppercase text-white/30">
                {item.href}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
