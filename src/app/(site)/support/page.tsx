"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, ShieldCheck, User as UserIcon, X, Activity, Radar, Timer } from "lucide-react";
import { User } from "@/lib/userStore";
import PremiumLoader from "@/components/loading/LoadingScreen";
import styles from "@/styles/app/support/page.module.css";

export default function SupportPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const fetchSupport = async () => {
    try {
      const response = await fetch("/api/members?role=SUPPORT&order=name&direction=asc", {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) setUsers(data as User[]);
    } catch {}
  };

  useEffect(() => {
    fetchSupport();
    let interval: number | null = null;
    const start = () => {
      if (interval !== null) return;
      interval = window.setInterval(() => {
        if (document.visibilityState !== "visible") return;
        fetchSupport();
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
        fetchSupport();
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
  }, []);

  const filtered = useMemo(() => users.filter((u) => !query || u.name.toLowerCase().includes(query.toLowerCase())), [query, users]);
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "ACTIVE").length;
    const inactive = total - active;
    const activeRate = total ? Math.round((active / total) * 100) : 0;
    return { total, active, inactive, activeRate };
  }, [users]);
  const selectedIndex = useMemo(() => {
    if (!selected) return -1;
    return users.findIndex((u) => u.id === selected.id);
  }, [selected, users]);

  const spotlight = useMemo(() => filtered.slice(0, 2), [filtered]);
  const roster = useMemo(() => filtered.slice(2), [filtered]);

  if (isAppLoading) return <PremiumLoader onFinished={() => setIsAppLoading(false)} />;

  return (
    <main className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.bgRadial} />
        <div className={styles.bgGrid} />
        <div className={styles.bgShoji} />
        <div className={styles.bgHalo} />
        <div className={styles.bgSweep} />
        <div className={styles.bgScanline} />
      </div>

      <header className={styles.topBar}>
        <div className={styles.navLeft}>
          <Link href="/" className={styles.backLink}>
            <div className={styles.backIcon}>
              <ArrowLeft size={18} />
            </div>
            <span className={styles.backText}>RETURN_CORE</span>
          </Link>
        </div>
        <div className={styles.navCenter}>SUPPORT STATION</div>
        <div className={styles.navRight}>
          <div className={styles.searchWrap}>
            <Search className={styles.searchIcon} size={14} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="TRACE_OPERATOR..."
              className={styles.searchInput}
            />
            <div className={styles.searchGlow} />
          </div>
          <div className={styles.liveBadge}>
            <span className={styles.liveDot} />
            LIVE
            <span className={styles.liveKanji}>稼働</span>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.heroKicker}>TACTICAL SUPPORT</div>
            <h1 className={styles.heroTitle}>
              <span>SUPPORT</span>
              GRID
            </h1>
            <p className={styles.heroDesc}>
              Live operational visibility, operator signals, and response readiness mapped in real time.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.metaItem}>UPLINK_STABLE</span>
              <span className={styles.metaItem}>SLA_READY</span>
              <span className={styles.metaItem}>SECURE_CHANNEL</span>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.statDeck}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>ACTIVE RATE</span>
                <span className={styles.statValue}>{stats.activeRate}%</span>
                <span className={styles.statSub}>Signal integrity</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>ACTIVE</span>
                <span className={styles.statValue}>{stats.active}</span>
                <span className={styles.statSub}>Operational units</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>INACTIVE</span>
                <span className={styles.statValue}>{stats.inactive}</span>
                <span className={styles.statSub}>Standby units</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.matrix}>
          <div className={styles.matrixHeader}>
            <div>
              <div className={styles.matrixTitle}>OPS MATRIX</div>
              <div className={styles.matrixSub}>SYSTEM_STATUS</div>
            </div>
            <div className={styles.matrixTag}>MONITOR</div>
          </div>
          <div className={styles.matrixGrid}>
            <div className={styles.matrixCard}>
              <div className={styles.matrixIcon}>
                <Activity size={16} />
              </div>
              <div>
                <div className={styles.matrixLabel}>ACTIVE SIGNAL</div>
                <div className={styles.matrixValue}>{stats.activeRate}%</div>
              </div>
            </div>
            <div className={styles.matrixCard}>
              <div className={styles.matrixIcon}>
                <Radar size={16} />
              </div>
              <div>
                <div className={styles.matrixLabel}>TOTAL UNITS</div>
                <div className={styles.matrixValue}>{stats.total}</div>
              </div>
            </div>
            <div className={styles.matrixCard}>
              <div className={styles.matrixIcon}>
                <Timer size={16} />
              </div>
              <div>
                <div className={styles.matrixLabel}>QUEUE</div>
                <div className={styles.matrixValue}>{stats.inactive}</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.roster}>
          <div className={styles.rosterHeader}>
            <div className={styles.rosterTitle}>SUPPORT ROSTER</div>
            <div className={styles.rosterCount}>{filtered.length} UNITS</div>
          </div>

          {spotlight.length > 0 && (
            <div className={styles.spotlightGrid}>
              {spotlight.map((u, idx) => (
                <button
                  key={u.id}
                  onClick={() => setSelected(u)}
                  className={`${styles.spotlightCard} group`}
                >
                  <div className={styles.cardHalo} />
                  <div className={styles.cardHead}>
                    <div className={styles.cardId}>ARC_{idx + 101}</div>
                    <div className={`${styles.cardStatus} ${u.status === "ACTIVE" ? styles.statusActive : styles.statusInactive}`}>
                      <span className={styles.statusDot} />
                      {u.status}
                    </div>
                  </div>
                  <div className={styles.cardName}>{u.name}</div>
                  <div className={styles.cardTitle}>{u.title || "UNDEFINED"}</div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardChip}>
                      <span className={styles.cardChipDot} />
                      PRIORITY
                    </div>
                    <div className={styles.cardJoined}>{u.joined || "UNKNOWN"}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className={styles.cardGrid}>
            {roster.map((u, idx) => (
              <button
                key={u.id}
                onClick={() => setSelected(u)}
                className={`${styles.userCard} group`}
              >
                <div className={styles.cardGlow} />
                <div className={styles.cardHead}>
                  <div className={styles.cardId}>ARC_{idx + 201}</div>
                  <div className={`${styles.cardStatus} ${u.status === "ACTIVE" ? styles.statusActive : styles.statusInactive}`}>
                    <span className={styles.statusDot} />
                    {u.status}
                  </div>
                </div>
                <div className={styles.cardName}>{u.name}</div>
                <div className={styles.cardTitle}>{u.title || "UNDEFINED"}</div>
                <div className={styles.cardFooter}>
                  <div className={styles.cardChip}>
                    <span className={styles.cardChipDot} />
                    SIGNAL
                  </div>
                  <div className={styles.cardJoined}>{u.joined || "UNKNOWN"}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {selected && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBackdrop} onClick={() => setSelected(null)} />
          <div className={styles.modalCard}>
            <button className={styles.modalClose} onClick={() => setSelected(null)}>
              <X size={16} />
            </button>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>UNIT_PROFILE</div>
              <div className={styles.modalSubtitle}>SECURITY_CLEARANCE</div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalAvatar}>
                <UserIcon size={36} />
              </div>
              <div className={styles.modalInfo}>
                <div className={styles.modalName}>{selected.name}</div>
                <div className={styles.modalMeta}>
                  <span className={styles.modalPill}>{selected.role}</span>
                  <span className={styles.modalDot} />
                  <span className={styles.modalPill}>{selected.status}</span>
                </div>
                <div className={styles.modalGrid}>
                  <div className={styles.modalItem}>
                    <div className={styles.modalLabel}>TITLE</div>
                    <div className={styles.modalValue}>{selected.title || "UNDEFINED"}</div>
                  </div>
                  <div className={styles.modalItem}>
                    <div className={styles.modalLabel}>JOINED</div>
                    <div className={styles.modalValue}>{selected.joined || "UNKNOWN"}</div>
                  </div>
                  <div className={styles.modalItem}>
                    <div className={styles.modalLabel}>UPLINK</div>
                    <div className={styles.modalValue}>STABLE</div>
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <div className={styles.modalNote}>
                    <ShieldCheck size={14} />
                    VERIFIED_UNIT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
