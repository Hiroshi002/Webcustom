"use client";

import { useEffect, useState } from "react";

interface LoadingProps {
  onFinished: () => void;
  systemName?: string;
}

export default function LoadingScreen({ onFinished, systemName = "SYSTEM_SYNC" }: LoadingProps) {
  const [percent, setPercent] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  const dbLogs = [
    `[SYSTEM] INITIALIZING_${systemName}...`,
    "[INFO] DECRYPTING_BIOMETRIC_DATA...",
    "[OK] SECURITY_BYPASS_COMPLETE",
    "[INFO] ESTABLISHING_OPERATOR_UPLINK...",
    "[STATUS] SYSTEM_READY_V3.0"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsClosing(true), 600);
          setTimeout(onFinished, 1200);
          return 100;
        }
        return prev + (Math.random() > 0.8 ? 12 : 4);
      });
    }, 35);
    return () => clearInterval(interval);
  }, [onFinished]);

  useEffect(() => {
    const logIndex = Math.floor((percent / 100) * dbLogs.length);
    if (dbLogs[logIndex] && !logs.includes(dbLogs[logIndex])) {
      setLogs((prev) => [...prev.slice(-2), dbLogs[logIndex]]);
    }
  }, [percent]);

  const safePercent = Math.min(percent, 100);
  const tips = [
    "Tip: Chain abilities for higher burst output.",
    "Tip: Keep stamina above 30% before engaging.",
    "Tip: Use cover to reset aggro faster.",
    "Tip: Upgrade core modules for passive boosts."
  ];
  const tipIndex = Math.min(tips.length - 1, Math.floor((safePercent / 100) * tips.length));

  return (
    <div
      className={`fixed inset-0 z-[1000] bg-[#020205] flex items-start sm:items-center justify-center overflow-y-auto overscroll-contain py-10 sm:py-12 transition-all duration-1000 ${
        isClosing ? "opacity-0 scale-150 blur-3xl" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 opacity-[0.2] bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="absolute inset-0 opacity-[0.2] bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_6px)]" />

      <div className="relative w-full max-w-5xl px-4 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
          <div className="border border-white/10 bg-black/70 backdrop-blur-2xl rounded-3xl px-6 sm:px-10 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] tracking-[0.5em] text-white/40 uppercase font-semibold">Loading Sequence</div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white">{systemName}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] tracking-[0.35em] uppercase text-emerald-300 flex items-center gap-2 justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                  Online
                </div>
                <div className="text-[9px] tracking-[0.35em] uppercase text-white/40 mt-2">Build 3.0.7</div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-end justify-between">
                <div className="text-5xl sm:text-6xl font-black text-white">
                  {safePercent}
                  <span className="text-lg text-cyan-300 ml-2">%</span>
                </div>
                <div className="text-[10px] tracking-[0.35em] uppercase text-white/40">Initializing Assets</div>
              </div>
              <div className="mt-4 h-3 w-full rounded-full bg-white/10 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-[0_0_18px_rgba(59,130,246,0.6)] transition-all duration-300"
                  style={{ width: `${safePercent}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[9px] tracking-[0.3em] uppercase text-white/40">
                <span>Streaming Data</span>
                <span>{Math.min(100, Math.floor(safePercent * 1.2))} MB</span>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-[8px] tracking-[0.3em] uppercase text-white/40">GPU Cache</div>
                <div className="mt-2 h-2 w-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-400/80" style={{ width: `${Math.min(100, safePercent + 12)}%` }} />
                </div>
              </div>
              <div className="border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-[8px] tracking-[0.3em] uppercase text-white/40">Shader Pack</div>
                <div className="mt-2 h-2 w-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-purple-400/80" style={{ width: `${Math.min(100, safePercent + 4)}%` }} />
                </div>
              </div>
              <div className="border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-[8px] tracking-[0.3em] uppercase text-white/40">Audio Bank</div>
                <div className="mt-2 h-2 w-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-cyan-400/80" style={{ width: `${Math.max(12, safePercent - 6)}%` }} />
                </div>
              </div>
              <div className="border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-[8px] tracking-[0.3em] uppercase text-white/40">World Data</div>
                <div className="mt-2 h-2 w-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-blue-400/80" style={{ width: `${Math.max(8, safePercent - 2)}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-8 border border-white/10 bg-black/50 px-4 py-3">
              <div className="text-[8px] tracking-[0.35em] uppercase text-white/40">System Log</div>
              <div className="mt-3 w-full flex flex-col items-start gap-1 min-h-[60px]">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={`font-mono text-[9px] tracking-widest uppercase transition-all duration-500 ${
                      i === logs.length - 1 ? "text-cyan-200" : "text-gray-600 opacity-40"
                    }`}
                  >
                    <span className="mr-2 opacity-50">{">"}</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative border border-white/10 bg-black/70 backdrop-blur-2xl rounded-3xl px-6 sm:px-10 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <div className="text-[10px] tracking-[0.5em] text-white/40 uppercase font-semibold">Mission Brief</div>
            <div className="mt-4 text-2xl sm:text-3xl font-black uppercase text-white">Operation Constancy</div>
            <div className="mt-3 text-sm text-white/60 leading-relaxed">
              Infiltrate the relay grid, stabilize the uplink, and secure operational access before full exposure.
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-[9px] tracking-[0.3em] uppercase text-white/40">
                <span>Connection</span>
                <span className="text-emerald-300">Stable</span>
              </div>
              <div className="flex items-center justify-between text-[9px] tracking-[0.3em] uppercase text-white/40">
                <span>Sector</span>
                <span className="text-white/70">Neo Tokyo / S-4</span>
              </div>
              <div className="flex items-center justify-between text-[9px] tracking-[0.3em] uppercase text-white/40">
                <span>Mode</span>
                <span className="text-white/70">Secure Access</span>
              </div>
            </div>

            <div className="mt-8 border border-white/10 bg-white/5 px-4 py-4">
              <div className="text-[8px] tracking-[0.35em] uppercase text-white/40">Tip</div>
              <div className="mt-2 text-sm text-cyan-200">{tips[tipIndex]}</div>
            </div>

            <div className="mt-8 flex items-center justify-between text-[9px] tracking-[0.35em] text-purple-200/70 uppercase">
              <span>東京局</span>
              <span className="w-1 h-1 rounded-full bg-purple-400/50" />
              <span>Init</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
