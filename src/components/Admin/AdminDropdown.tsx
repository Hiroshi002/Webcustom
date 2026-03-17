"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Menu,
  Home,
  Users,
  ClipboardList,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function AdminDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative z-[100]">
      <button
        onClick={() => setOpen(!open)}
        className={`
          group flex items-center gap-3 px-5 py-2.5 transition-all duration-500 border
          ${open
            ? "bg-gradient-to-r from-purple-600/80 to-blue-600/80 border-purple-400 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)]"
            : "bg-[#0b0b12] border-white/10 text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-500/10"
          }
          text-[10px] font-black tracking-[0.35em] uppercase
        `}
      >
        <div className="relative">
          <Menu size={16} className={`transition-transform duration-500 ${open ? "rotate-180 scale-110" : ""}`} />
          {!open && <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-none rotate-45 animate-pulse shadow-[0_0_10px_#34d399]" />}
        </div>
        <span className="drop-shadow-sm">System Menu</span>
        <ChevronDown size={14} className={`transition-transform duration-500 ${open ? "rotate-180" : "opacity-40"}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 sm:left-auto sm:right-0 mx-4 sm:mx-0 mt-3 w-full sm:w-[280px] bg-[#050508] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.75)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <div className="text-[9px] tracking-[0.4em] uppercase text-white/40">Admin Panel</div>
              <div className="text-sm font-black tracking-[0.3em] text-white/80 uppercase">Control Hub</div>
            </div>
            <span className="inline-flex items-center gap-2 text-[8px] font-black tracking-[0.35em] uppercase text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              Live
            </span>
          </div>

          <div className="p-3 space-y-2">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-4 py-3 text-[10px] text-white/50 hover:bg-white/5 hover:text-white transition-all uppercase font-black tracking-[0.3em]"
            >
              <Home size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-4 py-3 text-[10px] text-white/50 hover:bg-white/5 hover:text-white transition-all uppercase font-black tracking-[0.3em]"
            >
              <LayoutDashboard size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Admin Console</span>
            </Link>

            <div className="h-[1px] bg-white/10 my-2 mx-4" />

            <Link
              href="/admin/users"
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between px-4 py-3 text-[10px] text-purple-300 bg-purple-600/10 hover:bg-purple-600/40 hover:text-white transition-all uppercase font-black tracking-[0.3em] border border-purple-500/40"
            >
              <span className="flex items-center gap-3">
                <Users size={16} className="group-hover:scale-110 transition-transform" />
                Personnel Matrix
              </span>
              <ChevronDown size={12} className="rotate-[-90deg] opacity-60" />
            </Link>

            <Link
              href="/check"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-4 py-3 text-[10px] text-white/50 hover:bg-white/5 hover:text-white transition-all uppercase font-black tracking-[0.3em]"
            >
              <ClipboardList size={16} className="text-yellow-400 group-hover:scale-110 transition-transform" />
              <span>Audit Archive</span>
            </Link>

            <div className="h-[1px] bg-white/10 my-2 mx-4" />

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full group flex items-center justify-between px-4 py-3 text-[10px] text-red-400 hover:bg-red-600 hover:text-white transition-all uppercase font-black tracking-[0.3em] border border-red-500/30"
            >
              <span className="flex items-center gap-3">
                <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                Terminate Session
              </span>
              <ChevronDown size={12} className="rotate-[-90deg] opacity-60" />
            </button>
          </div>

          <div className="bg-white/[0.03] px-5 py-3 flex items-center justify-between border-t border-white/5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-cyan-400" />
              <span className="text-[8px] font-black text-white/20 tracking-[0.3em]">SECURED_UPLINK</span>
            </div>
            <Zap size={10} className="text-yellow-400 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
