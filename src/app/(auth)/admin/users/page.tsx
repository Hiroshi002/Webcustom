"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import UnifiedLoader from "@/components/loading/LoadingScreen";
import AdminDropdown from "@/components/Admin/AdminDropdown";
import styles from "@/styles/app/admin/users/page.module.css";
import { ArrowLeft, Search, User, Shield, X, Cpu, Trash2, Edit3, Plus, Save } from "lucide-react";

type Member = {
  id: number;
  name: string;
  title: string;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";
  joined?: string;
};

type FormData = {
  name: string;
  title: string;
  role: string;
  status: Member["status"];
};

const ROLES = ["HEAD", "LEAD", "SUPPORT", "EXCLUSIVE", "S.VIP", "VIP", "CONSTANCY"];

const ROLE_THEMES: Record<string, { color: string; border: string; glow: string }> = {
  HEAD: { color: "text-red-500", border: "border-red-500/30", glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]" },
  LEAD: { color: "text-purple-500", border: "border-purple-500/30", glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]" },
  SUPPORT: { color: "text-indigo-500", border: "border-indigo-500/30", glow: "shadow-[0_0_20px_rgba(99,102,241,0.15)]" },
  EXCLUSIVE: { color: "text-amber-500", border: "border-amber-500/30", glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]" },
  "S.VIP": { color: "text-pink-500", border: "border-pink-500/30", glow: "shadow-[0_0_20px_rgba(236,72,153,0.15)]" },
  VIP: { color: "text-green-500", border: "border-green-500/30", glow: "shadow-[0_0_20px_rgba(34,197,94,0.15)]" },
  CONSTANCY: { color: "text-blue-500", border: "border-blue-500/30", glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
};

const STATUS_THEMES = {
  ACTIVE: { color: "text-green-500", dot: "bg-green-500", glow: "shadow-[0_0_8px_#22c55e]" },
  INACTIVE: { color: "text-red-500", dot: "bg-red-500", glow: "shadow-[0_0_8px_#ef4444]" },
  PENDING: { color: "text-yellow-500", dot: "bg-yellow-500", glow: "shadow-[0_0_8px_#eab308]" },
  SUSPENDED: { color: "text-gray-500", dot: "bg-gray-500", glow: "shadow-[0_0_8px_#6b7280]" },
};

export default function AdminUsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Member["status"] | "ALL">("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Member | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const audio = (window as unknown as { __bgAudio?: HTMLAudioElement }).__bgAudio;
    if (!audio) return undefined;
    const prevMuted = audio.muted;
    const prevVolume = audio.volume;
    const wasPaused = audio.paused;
    audio.pause();
    audio.muted = true;
    audio.volume = 0;
    return () => {
      audio.muted = prevMuted;
      audio.volume = prevVolume;
      if (!wasPaused) {
        audio.play().catch(() => {});
      }
    };
  }, []);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    title: "",
    role: "CONSTANCY",
    status: "ACTIVE",
  });

  const loadUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/members?order=joined&direction=desc", {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data as Member[]);
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadUsers();
    let interval: number | null = null;
    const start = () => {
      if (interval !== null) return;
      interval = window.setInterval(() => {
        if (document.visibilityState !== "visible") return;
        loadUsers();
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
        loadUsers();
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
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
      if (!q) return true;
      return [u.name, u.title, u.role].some((v) => v?.toLowerCase().includes(q));
    });
  }, [search, users, statusFilter]);

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      title: formData.title.trim(),
      role: formData.role,
      status: formData.status,
      joined: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      if (response.ok) {
        await loadUsers();
        setFormData({ name: "", title: "", role: "CONSTANCY", status: "ACTIVE" });
        setShowForm(false);
      }
    } catch {}
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    const payload = {
      name: editingUser.name.trim(),
      title: editingUser.title.trim(),
      role: editingUser.role,
      status: editingUser.status,
    };

    try {
      const response = await fetch("/api/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editingUser.id }),
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers((current) => current.map((u) => (u.id === data.id ? (data as Member) : u)));
      }
      setEditingUser(null);
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch("/api/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
        cache: "no-store",
      });
      if (response.ok) {
        await loadUsers();
        setDeleteId(null);
      }
    } catch {}
  };

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "ACTIVE").length;
    const inactive = total - active;
    const roles = new Set(users.map((u) => u.role)).size;
    const activeRate = total ? Math.round((active / total) * 100) : 0;
    return { total, active, inactive, roles, activeRate };
  }, [users]);

  if (isLoading) return <UnifiedLoader onFinished={() => setIsLoading(false)} />;

  return (
    <main className={styles.mainContainer}>
      <div className={styles.backgroundLayer}>
        <div className={styles.bgRadial} />
        <div className={styles.bgGrid} />
        <div className={styles.bgShoji} />
        <div className={styles.bgHorizon} />
        <div className={styles.bgHalo} />
      </div>

      <nav className={styles.navBar}>
        <Link href="/admin" className={styles.backLink}>
          <div className={styles.backIconWrapper}>
            <ArrowLeft size={16} />
          </div>
          <span className={styles.backText}>Back_to_Admin</span>
        </Link>

        <div className={styles.navRight}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH_OPERATORS..."
              className={styles.searchInput}
            />
            <div className={styles.searchUnderline} />
          </div>
          <div className={styles.navDropdown}>
            <AdminDropdown />
          </div>
        </div>
      </nav>

      <div className={styles.pageFrame}>
        <header className={styles.headerGrid}>
          <div className={styles.headerMain}>
            <span className={styles.headerKicker}>ADMIN DIRECTORY</span>
            <h1 className={styles.headerTitle}>
              OPERATOR <span>REGISTRY</span>
            </h1>
            <p className={styles.headerSubtitle}>
              Live roster access, authorization state, and secure personnel control.
            </p>
            <div className={styles.headerMeta}>
              <span className={styles.metaItem}>SYNC LIVE</span>
              <span className={styles.metaItem}>ACCESS LOCKED</span>
              <span className={styles.metaItem}>AUDIT READY</span>
            </div>
          </div>
          <div className={styles.headerSide}>
            <div className={styles.statRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>TOTAL</span>
                <span className={styles.statValue}>{stats.total}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>ACTIVE</span>
                <span className={styles.statValue}>{stats.active}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>INACTIVE</span>
                <span className={styles.statValue}>{stats.inactive}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>RATE</span>
                <span className={styles.statValue}>{stats.activeRate}%</span>
              </div>
            </div>
            <div className={styles.actionPanel}>
              <button
                className={styles.actionPrimary}
                onClick={() => {
                  setEditingUser(null);
                  setShowForm(true);
                }}
                type="button"
              >
                <Plus size={16} />
                NEW_UNIT
              </button>
              <div className={styles.actionInfo}>
                <Cpu size={16} />
                REALTIME_SYNC_ACTIVE
              </div>
            </div>
          </div>
        </header>

        <section className={styles.controlBar}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH_OPERATORS..."
              className={styles.searchInput}
            />
            <div className={styles.searchUnderline} />
          </div>
          <div className={styles.filterGroup}>
            {(["ALL", "ACTIVE", "PENDING", "INACTIVE", "SUSPENDED"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`${styles.filterChip} ${statusFilter === status ? styles.filterChipActive : ""}`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className={styles.controlMeta}>
            <User size={14} />
            {filteredUsers.length} UNITS
          </div>
        </section>

        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <div className={styles.listTitle}>ACTIVE OPERATORS</div>
            <div className={styles.listCount}>{filteredUsers.length} UNITS</div>
          </div>
          {filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>NO MATCHING UNITS</div>
          ) : (
            <div className={styles.listGrid}>
              {filteredUsers.map((u, idx) => (
                <div key={u.id} className={`${styles.userCard} ${ROLE_THEMES[u.role]?.border || ""}`}>
                  <div className={styles.cardGlow} />
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIdentity}>
                      <span className={styles.cardCode}>ARC_{idx + 4001}</span>
                      <span className={styles.cardName}>{u.name}</span>
                      <span className={styles.cardTitle}>{u.title || "UNDEFINED"}</span>
                    </div>
                    <div className={`${styles.cardStatus} ${STATUS_THEMES[u.status].color}`}>
                      <span className={`${styles.statusDot} ${STATUS_THEMES[u.status].dot} ${STATUS_THEMES[u.status].glow}`} />
                      {u.status}
                    </div>
                  </div>
                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>ROLE</span>
                      <span className={`${styles.metaValue} ${ROLE_THEMES[u.role]?.color || ""}`}>{u.role}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>JOINED</span>
                      <span className={styles.metaValue}>{u.joined || "UNDEFINED"}</span>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => setEditingUser(u)}
                      className={styles.cardAction}
                      type="button"
                    >
                      <Edit3 size={14} />
                      <span className={styles.actionLabel}>EDIT</span>
                    </button>
                    <button
                      onClick={() => setDeleteId(u.id)}
                      className={`${styles.cardAction} ${styles.cardActionDanger}`}
                      type="button"
                    >
                      <Trash2 size={14} />
                      <span className={styles.actionLabel}>DELETE</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBackdrop} onClick={() => setShowForm(false)} />
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <Shield size={18} />
                CREATE_UNIT
              </div>
              <button className={styles.modalClose} onClick={() => setShowForm(false)}>
                <X size={16} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <input
                className={styles.input}
                placeholder="NAME"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
              <input
                className={styles.input}
                placeholder="TITLE"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
              <select
                className={styles.input}
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <select
                className={styles.input}
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as Member["status"] }))}
              >
                {Object.keys(STATUS_THEMES).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button className={styles.primaryButton} onClick={handleCreate}>
                <Save size={14} />
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBackdrop} onClick={() => setEditingUser(null)} />
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <Edit3 size={18} />
                EDIT_UNIT
              </div>
              <button className={styles.modalClose} onClick={() => setEditingUser(null)}>
                <X size={16} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <input
                className={styles.input}
                value={editingUser.name}
                onChange={(e) => setEditingUser((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
              />
              <input
                className={styles.input}
                value={editingUser.title}
                onChange={(e) => setEditingUser((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
              />
              <select
                className={styles.input}
                value={editingUser.role}
                onChange={(e) => setEditingUser((prev) => (prev ? { ...prev, role: e.target.value } : prev))}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <select
                className={styles.input}
                value={editingUser.status}
                onChange={(e) => setEditingUser((prev) => (prev ? { ...prev, status: e.target.value as Member["status"] } : prev))}
              >
                {Object.keys(STATUS_THEMES).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button className={styles.primaryButton} onClick={handleUpdate}>
                <Save size={14} />
                UPDATE
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBackdrop} onClick={() => setDeleteId(null)} />
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <Trash2 size={18} />
                DELETE_UNIT
              </div>
              <button className={styles.modalClose} onClick={() => setDeleteId(null)}>
                <X size={16} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>Confirm deletion?</p>
              <button className={styles.dangerButton} onClick={handleDelete}>
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
