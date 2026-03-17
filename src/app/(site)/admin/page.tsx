"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Settings, LogOut, ChevronRight, Activity, X, Database, ShieldAlert, Power, ArrowLeft } from "lucide-react";
import UnifiedLoader from "@/components/loading/LoadingScreen";
import styles from "@/styles/app/admin/page.module.css";

export default function AdminPage() {
  // const { data: session, status } = useSession();
  const sessionContext = useSession();
  const session = sessionContext?.data;
  const status = sessionContext?.status;
  const router = useRouter();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const parseMaintenance = (value: unknown) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true" || value === "1";
    return false;
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [router, status]);

  useEffect(() => {
    async function getMaintenanceStatus() {
      try {
        const response = await fetch("/api/system/maintenance", { cache: "no-store" });
        if (!response.ok) return;
        const data = await parseJsonSafely(response);
        if (data?.ok) setIsMaintenance(parseMaintenance(data.value));
      } catch {
        return;
      }
    }
    getMaintenanceStatus();
  }, []);

  const extractErrorCode = (payload: unknown) => {
    if (!payload || typeof payload !== "object") return "UNKNOWN_ERROR";
    const error = (payload as { error?: string }).error;
    return error || "UNKNOWN_ERROR";
  };

  const parseJsonSafely = async (response: Response) => {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const handleToggleMaintenance = async () => {
    setIsToggling(true);
    const nextState = !isMaintenance;
    try {
      const response = await fetch("/api/system/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: nextState }),
      });
      if (!response.ok) {
        const payload = await parseJsonSafely(response);
        const code = extractErrorCode(payload);
        alert(`DATABASE_SYNC_ERROR (${code}): ไม่สามารถเปลี่ยนสถานะระบบได้`);
      } else {
        const data = await parseJsonSafely(response);
        if (data?.ok) setIsMaintenance(parseMaintenance(data.value));
        else {
          const code = extractErrorCode(data);
          alert(`DATABASE_SYNC_ERROR (${code}): ไม่สามารถเปลี่ยนสถานะระบบได้`);
        }
      }
    } catch {
      alert("DATABASE_SYNC_ERROR (NETWORK): ไม่สามารถเปลี่ยนสถานะระบบได้");
    }
    setIsToggling(false);
  };

  const handleUnderDev = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  if (status === "loading" || isAppLoading) {
    return <UnifiedLoader onFinished={() => setIsAppLoading(false)} />;
  }
  if (!session) return null;

  return (
    <main className={styles.page}>
      <div className={styles.background}>
        <div
          className={styles.radialSpot}
          style={{ "--spot-x": "50%", "--spot-y": "15%" } as CSSProperties}
        />
        <div className={styles.gridPattern} />
        <div className={styles.shojiPattern} />
        <div className={styles.horizonGlow} />
        <div className={styles.sakuraHalo} />
      </div>

      <nav className={styles.nav}>
        <div className={styles.navFrame}>
          <div className={styles.navLeft}>
            <Link href="/" className={styles.navBack}>
              <span className={styles.navIcon}>
                <ArrowLeft size={16} />
              </span>
              <span className={styles.navText}>Back_to_Earth</span>
            </Link>
            <div className={styles.navBadge}>
              <span className={styles.navBadgeLabel}>SECTION</span>
              <span className={styles.navBadgeValue}>ADMIN</span>
            </div>
          </div>
          <div className={styles.navCenter}>
            <span className={styles.navTitle}>ADMIN CONSOLE</span>
            <span className={styles.navSubtitle}>SYSTEM CONTROL NODE</span>
          </div>
          <div className={styles.navRight}>
            <div className={styles.navChip}>
              <Activity size={12} />
              <span className={styles.navChipLabel}>SESSION</span>
              <span className={styles.navChipValue}>ACTIVE</span>
            </div>
            <Link href="/admin/users" className={styles.navLink}>
              <Database size={14} />
              <span>PERSONNEL_MATRIX</span>
            </Link>
          </div>
        </div>
      </nav>

      {showAlert && (
        <div className={styles.toastWrapper}>
          <div className={styles.toastBox}>
            <ShieldAlert size={20} className={styles.toastIcon} />
            <div className={styles.toastTextWrapper}>
              <span className={styles.toastTitle}>Access_Denied</span>
              <span className={styles.toastDesc}>Module_Under_Deployment</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroMain}>
            <span className={styles.heroKicker}>COMMAND CORE</span>
            <h1 className={styles.heroTitle}>
              CONTROL
              <span>OVERSIGHT</span>
            </h1>
            <p className={styles.heroSub}>
              Monitor authentication pipelines, tune global access gates, and orchestrate operational continuity.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}>OPERATOR: {session.user?.name || "ROOT"}</span>
              <span className={styles.heroMetaItem}>ID: {(session.user as any)?.id?.slice(0, 8) || "00-AD"}</span>
              <span className={styles.heroMetaItem}>ACCESS: FULL</span>
            </div>
          </div>
          <div className={styles.heroPanel}>
            <div className={styles.statusHeader}>
              <span className={styles.statusLabel}>SYSTEM STATUS</span>
              <span className={`${styles.statusBadge} ${isMaintenance ? styles.statusBadgeDanger : styles.statusBadgeSafe}`}>
                <Power size={14} />
                {isMaintenance ? "LOCKED" : "LIVE"}
              </span>
            </div>
            <div className={styles.statusTitle}>{isMaintenance ? "LOCKDOWN_ACTIVE" : "OPERATIONAL"}</div>
            <div className={styles.statusGrid}>
              <div className={styles.statusItem}>
                <span className={styles.statusKey}>MODE</span>
                <span className={styles.statusValue}>{isMaintenance ? "MAINTENANCE" : "NORMAL"}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusKey}>UPLINK</span>
                <span className={styles.statusValue}>{isMaintenance ? "SEALED" : "LIVE"}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusKey}>AUTH</span>
                <span className={styles.statusValue}>V5.2</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusKey}>SESSION</span>
                <span className={styles.statusValue}>ACTIVE</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleMaintenance}
              disabled={isToggling}
              className={`${styles.toggleButton} ${isMaintenance ? styles.toggleButtonActive : ""}`}
            >
              {isToggling ? "SYNCING..." : isMaintenance ? "DISABLE_MAINTENANCE" : "ENABLE_MAINTENANCE"}
            </button>
          </div>
        </section>

        <section className={styles.coreGrid}>
          <div className={`${styles.identityCard} group`}>
            <div className={styles.identityHeader}>
              <div className={styles.identityImageWrap}>
                <div className={styles.identityGlow} />
                <div className={styles.identityImageFrame}>
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Admin"
                      width={144}
                      height={144}
                      className={styles.identityImg}
                    />
                  ) : (
                    <div className={styles.identityPlaceholder}>NO_IMG</div>
                  )}
                </div>
              </div>
              <div className={styles.identityInfo}>
                <div className={styles.identityTag}>
                  <Activity size={12} />
                  <span>Admin_Session_Active</span>
                </div>
                <div className={styles.identityName}>{session.user?.name || "ROOT"}</div>
                <div className={styles.identityRole}>SYSTEM_ROOT</div>
              </div>
            </div>
            <div className={styles.identityGrid}>
              <div className={styles.identityItem}>
                <span className={styles.identityKey}>ROLE</span>
                <span className={styles.identityValue}>SYSTEM_ROOT</span>
              </div>
              <div className={styles.identityItem}>
                <span className={styles.identityKey}>ACCESS</span>
                <span className={styles.identityValue}>FULL</span>
              </div>
              <div className={styles.identityItem}>
                <span className={styles.identityKey}>AUTH</span>
                <span className={styles.identityValue}>V5.2</span>
              </div>
              <div className={styles.identityItem}>
                <span className={styles.identityKey}>SESSION</span>
                <span className={styles.identityValue}>ACTIVE</span>
              </div>
            </div>
          </div>

          <div className={styles.alertCard}>
            <div className={styles.alertHeader}>
              <span className={styles.alertKicker}>SECURITY LAYERS</span>
              <span className={styles.alertTitle}>ACCESS CHANNELS</span>
            </div>
            <div className={styles.alertGrid}>
              <div className={styles.alertItem}>
                <span className={styles.alertLabel}>PRIMARY</span>
                <span className={styles.alertValue}>GREENLINE</span>
              </div>
              <div className={styles.alertItem}>
                <span className={styles.alertLabel}>BACKUP</span>
                <span className={styles.alertValue}>SYNTH_NODE</span>
              </div>
              <div className={styles.alertItem}>
                <span className={styles.alertLabel}>INTEGRITY</span>
                <span className={styles.alertValue}>STABLE</span>
              </div>
              <div className={styles.alertItem}>
                <span className={styles.alertLabel}>FIREWALL</span>
                <span className={styles.alertValue}>ALIGNED</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.actionGrid}>
          <Link href="/admin/users" className={`${styles.actionCard} ${styles.actionCardWide} group`}>
            <div className={styles.actionTop}>
              <div>
                <div className={styles.actionTitle}>PERSONNEL_ARCHIVE</div>
                <div className={styles.actionDesc}>MANAGE MEMBER DATABASE AND SECURITY CLEARANCE</div>
              </div>
              <div className={styles.actionIcon}>
                <Database size={22} />
              </div>
            </div>
            <div className={styles.actionFooter}>
              <span>OPEN_ARCHIVE</span>
              <ChevronRight size={16} className={styles.actionChevron} />
            </div>
          </Link>

          <button type="button" onClick={handleUnderDev} className={`${styles.actionCard} group`}>
            <div className={styles.actionTop}>
              <div>
                <div className={styles.actionTitle}>SYSTEM_GATEWAY</div>
                <div className={styles.actionDesc}>GLOBAL API AND AUTHENTICATION MODULES</div>
              </div>
              <div className={styles.actionIcon}>
                <Settings size={22} />
              </div>
            </div>
            <div className={styles.actionFooter}>
              <span>LOCKED_ZONE</span>
              <ChevronRight size={16} className={styles.actionChevron} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className={`${styles.actionCard} ${styles.actionCardDanger} group`}
          >
            <div className={styles.actionTop}>
              <div>
                <div className={styles.actionTitle}>LOGOUT_CORE</div>
                <div className={styles.actionDesc}>TERMINATE SESSION AND WIPE LOCAL CACHE</div>
              </div>
              <div className={styles.actionIcon}>
                <LogOut size={22} />
              </div>
            </div>
            <div className={styles.actionFooter}>
              <span>FORCE_EXIT</span>
              <ChevronRight size={16} className={styles.actionChevron} />
            </div>
          </button>
        </section>
      </div>

      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBackdrop} onClick={() => setShowLogoutConfirm(false)} />
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <ShieldAlert size={20} />
                CONFIRM_LOGOUT
              </div>
              <button onClick={() => setShowLogoutConfirm(false)} className={styles.modalClose}>
                <X size={18} />
              </button>
            </div>
            <p className={styles.modalDesc}>Terminate active admin session?</p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setShowLogoutConfirm(false)}
              >
                CANCEL
              </button>
              <button
                className={styles.modalConfirm}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
