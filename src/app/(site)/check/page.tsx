"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, User as UserIcon } from "lucide-react";
import UnifiedLoader from "@/components/loading/LoadingScreen";
import styles from "@/styles/app/check/page.module.css";

/* ================= TYPES & THEMES ================= */
export type User = { id: number; name: string; role: string; title: string; status: "ACTIVE" | "INACTIVE"; joined: string; };
const ROLE_ORDER = ["HEAD", "LEAD", "SUPPORT", "EXCLUSIVE", "S.VIP", "VIP", "CONSTANCY"];

const THEMES: Record<string, { color: string; border: string; glow: string }> = {
  HEAD: { color: "text-red-500", border: "border-red-500/30", glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]" },
  LEAD: { color: "text-purple-500", border: "border-purple-500/30", glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]" },
  SUPPORT: { color: "text-indigo-500", border: "border-indigo-500/30", glow: "shadow-[0_0_20px_rgba(99,102,241,0.15)]" },
  EXCLUSIVE: { color: "text-amber-500", border: "border-amber-500/30", glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]" },
  "S.VIP": { color: "text-pink-500", border: "border-pink-500/30", glow: "shadow-[0_0_20px_rgba(236,72,153,0.15)]" },
  VIP: { color: "text-green-500", border: "border-green-500/30", glow: "shadow-[0_0_20px_rgba(34,197,94,0.15)]" },
  CONSTANCY: { color: "text-blue-500", border: "border-blue-500/30", glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
};

export default function CheckPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/members?order=joined&direction=desc", {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) setUsers(data as User[]);
    } catch {}
  }, []);

  useEffect(() => {
    load();
    let interval: number | null = null;
    const start = () => {
      if (interval !== null) return;
      interval = window.setInterval(() => {
        if (document.visibilityState !== "visible") return;
        load();
      }, 5000);
    };
    const stop = () => {
      if (interval === null) return;
      window.clearInterval(interval);
      interval = null;
    };
    start();
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        load();
        start();
      } else {
        stop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.title, u.role, u.status].some((v) => v?.toLowerCase().includes(q))
    );
  }, [query, users]);

  const filteredGroups = useMemo(() => {
    return filtered.reduce<Record<string, User[]>>((acc, u) => {
      if (!acc[u.role]) acc[u.role] = [];
      acc[u.role].push(u);
      return acc;
    }, {});
  }, [filtered]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "ACTIVE").length;
    const roles = new Set(users.map((u) => u.role)).size;
    const inactive = total - active;
    const activeRate = total ? Math.round((active / total) * 100) : 0;
    return { total, active, inactive, roles, activeRate };
  }, [users]);

  if (isLoading) return <UnifiedLoader onFinished={() => setIsLoading(false)} />;

  return (
    <main className={styles.page}>
      <div className={styles.background}>
        <div className={styles.bgRadial} />
        <div className={styles.bgGrid} />
        <div className={styles.bgShoji} />
        <div className={styles.bgHorizon} />
        <div className={styles.bgHalo} />
        <div className={styles.bgNoise} />
        <div className={styles.bgScanline} />
      </div>

      <nav className={styles.nav}>
        <div className={styles.navFrame}>
          <div className={styles.navLeft}>
            <Link href="/" className={styles.navBack}>
              <div className={styles.navIcon}>
                <ArrowLeft size={16} />
              </div>
              <span className={styles.navText}>Back_to_Home</span>
            </Link>
            <div className={styles.navBadge}>
              <span className={styles.navBadgeLabel}>SECTION</span>
              <span className={styles.navBadgeValue}>CHECK</span>
            </div>
          </div>
          <div className={styles.navCenter}>
            <span className={styles.navTitle}>PERSONNEL CHECK</span>
            <span className={styles.navSubtitle}>CONSTANCY ARCHIVE</span>
          </div>
          <div className={styles.navRight}>
            <div className={styles.searchWrap}>
              <Search className={styles.searchIcon} size={14} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH_OPERATOR..."
                className={styles.searchInput}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className={styles.searchClear}
                >
                  CLEAR
                </button>
              )}
              <div className={styles.searchGlow} />
            </div>
            <div className={styles.navStats}>
              <span className={styles.navStatLabel}>RESULTS</span>
              <span className={styles.navStatValue}>{filtered.length}/{users.length}</span>
            </div>
            <div className={styles.liveBadge}>
              <span className={styles.liveDot} />
              LIVE_SYNC
              <span className={styles.liveKanji}>稼働</span>
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.container}>
        <section className={styles.overview}>
          <div className={styles.overviewMain}>
            <span className={styles.overviewKicker}>CHECKPOINT_09</span>
            <h1 className={styles.overviewTitle}>
              PERSONNEL
              <span>CHECKLIST</span>
            </h1>
            <p className={styles.overviewSub}>
              Real-time operator manifest with status, role, and active clearance overview.
            </p>
            <div className={styles.overviewMeta}>
              <span className={styles.overviewMetaItem}>TOTAL {stats.total}</span>
              <span className={styles.overviewMetaItem}>ACTIVE {stats.active}</span>
              <span className={styles.overviewMetaItem}>ROLES {stats.roles}</span>
            </div>
          </div>
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>MATCHES</span>
              <span className={styles.overviewValue}>{filtered.length}</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>ACTIVE RATE</span>
              <span className={styles.overviewValue}>{stats.activeRate}%</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>INACTIVE</span>
              <span className={styles.overviewValue}>{stats.inactive}</span>
            </div>
            <div className={styles.overviewCard}>
              <span className={styles.overviewLabel}>ROLES</span>
              <span className={styles.overviewValue}>{stats.roles}</span>
            </div>
          </div>
        </section>

        <section className={styles.roleToolbar}>
          <div className={styles.roleChips}>
            {ROLE_ORDER.map((role) => {
              const list = filteredGroups[role];
              if (!list?.length) return null;
              return (
                <span key={`${role}-chip`} className={`${styles.roleChip} ${THEMES[role].border}`}>
                  <span>{role}</span>
                  <span className={styles.roleChipCount}>{list.length}</span>
                </span>
              );
            })}
          </div>
          <div className={styles.statusLegend}>
            <span className={styles.statusLegendItem}>
              <span className={`${styles.statusLegendDot} ${styles.statusLegendActive}`} />
              ACTIVE
            </span>
            <span className={styles.statusLegendItem}>
              <span className={`${styles.statusLegendDot} ${styles.statusLegendInactive}`} />
              INACTIVE
            </span>
          </div>
        </section>

        {ROLE_ORDER.map((role) => {
          const list = filteredGroups[role];
          if (!list?.length) return null;

          return (
            <section key={role} className={styles.roleSection}>
              <div className={styles.roleHeader}>
                <div className={styles.roleTitleWrap}>
                  <h2 className={`${styles.roleTitle} ${THEMES[role].color}`}>
                    {role}
                  </h2>
                  <span className={styles.roleTag}>部隊</span>
                </div>
                <div className={styles.roleDivider} />
                <span className={styles.roleCount}>Nodes: {list.length}</span>
              </div>
              <div className={styles.cardGrid}>
                {list.map((u, idx) => (
                  <button
                    key={u.id}
                    onClick={() => setSelected(u)}
                    className={`${styles.userCard} ${THEMES[role].border} ${THEMES[role].glow}`}
                  >
                    <div className={styles.cardHalo} />
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}>
                        <UserIcon size={18} />
                      </div>
                      <div className={styles.cardHeaderMeta}>
                        <span className={styles.cardCode}>ARC_{idx + 1001}</span>
                        <div className={styles.statusPill}>
                          <span className={`${styles.statusDot} ${u.status === "ACTIVE" ? styles.statusActive : styles.statusInactive}`} />
                          <span>{u.status}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className={styles.cardName}>{u.name}</h3>
                    <p className={styles.cardTitle}>{u.title || "UNDEFINED"}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardRole}>{u.role}</span>
                      <span className={styles.cardJoined}>{u.joined || "UNKNOWN"}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          );
        })}

        {!Object.keys(filteredGroups).length && (
          <div className={styles.emptyState}>
            <span className={styles.emptyTitle}>NO_MATCH_FOUND</span>
            <span className={styles.emptySub}>Try another search token.</span>
          </div>
        )}
      </div>
    </main>
  );
}
