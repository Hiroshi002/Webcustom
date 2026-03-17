"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Cpu, Zap, Command, Box, Disc } from "lucide-react";
import LoadingScreen from "@/components/loading/LoadingScreen";

export default function BlackPurpleMaintenance() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const sensitivity = window.innerWidth < 768 ? 15 : 40;
      const x = (e.clientX / window.innerWidth - 0.5) * sensitivity;
      const y = (e.clientY / window.innerHeight - 0.5) * sensitivity;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  if (isLoading) {
    return <LoadingScreen onFinished={() => setIsLoading(false)} systemName="CORE_OFFLINE" />;
  }

  return (
    <main className="relative min-h-screen bg-transparent text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "var(--random-bg-url, none)", filter: "blur(8px)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.06), transparent 50%, rgba(0,0,0,0.06))",
            backgroundSize: "3px 3px, 100% 100%",
            opacity: 0.25,
            mixBlendMode: "soft-light",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1f1b3a_0%,#05060b_70%)] opacity-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px),repeating-linear-gradient(45deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_18px)] bg-[size:72px_72px,72px_72px,140px_140px] [mask-image:radial-gradient(ellipse_80%_55%_at_50%_45%,#000_65%,transparent_100%)] opacity-0" />
        <div className="absolute left-[-10%] right-[-10%] bottom-[10%] h-[240px] bg-[linear-gradient(90deg,transparent,rgba(167,139,250,0.18),rgba(16,185,129,0.08),transparent)] blur-[28px] opacity-0" />
        <div className="absolute w-[520px] h-[520px] left-[10%] top-[10%] bg-[radial-gradient(circle,rgba(129,140,248,0.16),rgba(14,116,144,0.06),transparent_65%)] blur-[8px] opacity-0" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -1100], opacity: [0, 0.6, 0], scale: [0.4, 1.4] }}
            transition={{ duration: Math.random() * 8 + 12, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute w-1 h-24 bg-gradient-to-t from-transparent via-indigo-400 to-transparent"
            style={{ left: `${Math.random() * 100}%`, bottom: "-10%" }}
          />
        ))}
      </div>

      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y, rotateY: mousePos.x / 6, rotateX: -mousePos.y / 6 }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 pt-28 pb-24"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex items-center justify-between text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-white/40">
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-indigo-300" />
            MAINTENANCE_PROTOCOL
          </div>
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-rose-300" />
            ACCESS RESTRICTED
          </div>
        </div>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <div className="text-[10px] tracking-[0.5em] uppercase text-indigo-200/70">CONSTANCY NODE</div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none uppercase">
              SYSTEM
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-white/20">
                OFFLINE
              </span>
            </h1>
            <p className="text-base text-white/55 max-w-xl">
              Core services are undergoing a protocol rewrite. Access channels are sealed while we recalibrate stability layers.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-[9px] tracking-[0.35em] uppercase text-indigo-100">
                STATUS: RECALIBRATING
              </span>
              <span className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-[9px] tracking-[0.35em] uppercase text-white/60">
                ETA: UNKNOWN
              </span>
              <span className="inline-flex items-center gap-2 border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-[9px] tracking-[0.35em] uppercase text-emerald-100">
                NODE: WB-VOID
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute w-[260px] h-[260px] md:w-[420px] md:h-[420px] bg-indigo-500/15 blur-[100px] rounded-full animate-pulse" />
            <div className="relative w-48 h-48 md:w-72 md:h-72">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-indigo-400/30 rounded-[30%] shadow-[0_0_40px_rgba(129,140,248,0.2)]"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-dashed border-sky-400/40 rounded-full"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute inset-8 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(129,140,248,0.2)] overflow-hidden"
              >
                <Disc
                  className="w-16 h-16 md:w-20 md:h-20 text-indigo-300 drop-shadow-[0_0_15px_rgba(129,140,248,0.8)] animate-spin"
                  style={{ animationDuration: "8s" }}
                />
                <div className="mt-4 text-[9px] tracking-[0.3em] uppercase text-indigo-100">VOID LINK</div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="border border-white/10 bg-white/5 px-6 py-5 rounded-2xl">
            <div className="text-[9px] tracking-[0.35em] uppercase text-white/40">Rebuild Queue</div>
            <div className="mt-3 text-2xl font-black tracking-tight uppercase">SYNC 43%</div>
          </div>
          <div className="border border-white/10 bg-white/5 px-6 py-5 rounded-2xl">
            <div className="text-[9px] tracking-[0.35em] uppercase text-white/40">Integrity Check</div>
            <div className="mt-3 text-2xl font-black tracking-tight uppercase">STABLE</div>
          </div>
          <div className="border border-white/10 bg-white/5 px-6 py-5 rounded-2xl">
            <div className="text-[9px] tracking-[0.35em] uppercase text-white/40">Signal</div>
            <div className="mt-3 text-2xl font-black tracking-tight uppercase">PULSING</div>
          </div>
        </section>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-30 flex items-end justify-between p-6 md:p-10 text-[8px] md:text-[10px] tracking-[0.35em] uppercase text-white/30">
        <div className="flex items-center gap-3">
          <Command size={12} className="text-indigo-300" />
          CORE: WB-VOID
        </div>
        <div className="flex items-center gap-3">
          <Cpu size={12} className="text-emerald-300" />
          SECTOR: 0x99
        </div>
        <div className="flex items-center gap-3">
          <Zap size={12} className="text-amber-300" />
          UPLINK: PULSE
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(88,28,135,0.06)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(99,102,241,0.03),rgba(0,0,0,0),rgba(99,102,241,0.03))] bg-[size:100%_3px,3px_100%]" />
      </div>
    </main>
  );
}
