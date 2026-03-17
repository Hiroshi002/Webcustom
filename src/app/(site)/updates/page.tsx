"use client";

const changelog = [
  {
    date: "2026-02-12",
    title: "Loading Screen",
    details: [
      "รองรับหน้าจอเล็กด้วยการเลื่อนในแนวตั้ง",
      "จัดระยะขอบให้พอดีกับมือถือและแท็บเล็ต",
      "รองรับ LoadingScreenHome ด้วยคอมโพเนนต์เดียวกัน"
    ]
  },
  {
    date: "2026-02-12",
    title: "Admin Access",
    details: [
      "กันผู้ใช้ที่ยังไม่ล็อกอินจากหน้า /admin",
      "ปรับเส้นทางออกจากระบบให้กลับหน้า Home",
      "ปรับเส้นทางออกจากระบบในเมนูแอดมินและหน้า logout"
    ]
  }
];

export default function UpdatesPage() {
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
            <div className="text-[10px] tracking-[0.45em] uppercase text-white/40">Update Hub</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
              Update <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-purple-400">Log</span>
            </h1>
            <p className="mt-3 text-sm text-white/60 max-w-xl">
              สรุปการอัปเดตทั้งหมดของระบบและรายละเอียดการปรับปรุงล่าสุด
            </p>
          </div>
          <div className="border border-white/10 bg-white/5 px-4 py-3 text-[10px] tracking-[0.35em] uppercase text-white/50">
            Version: 1.0.x
          </div>
        </div>

        <section className="mt-10 border border-white/10 bg-white/5 rounded-3xl px-5 sm:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] tracking-[0.45em] uppercase text-white/40">Changelog</div>
              <div className="mt-2 text-2xl sm:text-3xl font-black uppercase text-white">Recent Updates</div>
            </div>
            <div className="text-[10px] tracking-[0.35em] uppercase text-white/50">Deploy Notes</div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {changelog.map((entry) => (
              <div key={`${entry.date}-${entry.title}`} className="border border-white/10 bg-black/40 rounded-2xl px-5 py-5">
                <div className="flex items-center justify-between text-[10px] tracking-[0.35em] uppercase text-white/40">
                  <span>{entry.date}</span>
                  <span>Update</span>
                </div>
                <div className="mt-3 text-lg font-black uppercase text-white">{entry.title}</div>
                <div className="mt-3 space-y-2 text-sm text-white/70">
                  {entry.details.map((item, index) => (
                    <div key={`${entry.title}-${index}`} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300/80" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
