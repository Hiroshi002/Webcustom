"use client";

import { useMemo } from "react";

type StatusValue = "active" | "inactive" | "pending" | "suspended";

type StatusPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  currentStatus: StatusValue;
  onUpdate: (newStatus: StatusValue) => void;
};

const STATUS_ITEMS: Array<{ value: StatusValue; label: string; color: string }> = [
  { value: "active", label: "ACTIVE", color: "text-green-400 border-green-500/40 bg-green-500/10" },
  { value: "inactive", label: "INACTIVE", color: "text-red-400 border-red-500/40 bg-red-500/10" },
  { value: "pending", label: "PENDING", color: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10" },
  { value: "suspended", label: "SUSPENDED", color: "text-purple-400 border-purple-500/40 bg-purple-500/10" },
];

export default function StatusPopup({
  isOpen,
  onClose,
  userName,
  currentStatus,
  onUpdate,
}: StatusPopupProps) {
  const activeValue = useMemo(() => currentStatus?.toLowerCase() as StatusValue, [currentStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[650] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-md border border-white/10 bg-[#06060b] shadow-[0_0_60px_rgba(0,0,0,0.8)]">
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-white/20 to-purple-600" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-[9px] tracking-[0.6em] font-black text-white/40 uppercase italic">Status_Control</span>
              <span className="text-xl font-black italic text-white uppercase tracking-tight">{userName || "UNKNOWN"}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/30 hover:text-white transition-colors text-sm font-black tracking-widest uppercase"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STATUS_ITEMS.map((item) => {
              const isActive = activeValue === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onUpdate(item.value)}
                  className={`px-4 py-4 border text-[10px] font-black tracking-[0.4em] uppercase italic transition-all ${
                    isActive
                      ? `${item.color} shadow-[0_0_25px_rgba(168,85,247,0.35)]`
                      : "text-white/40 border-white/10 bg-white/5 hover:border-purple-500/40 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
