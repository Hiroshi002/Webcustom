"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Cpu, Globe } from "lucide-react";
import UnifiedLoader from "@/components/loading/LoadingScreen";
import styles from "@/styles/app/login/page.module.css";


export default function AdminLoginPage() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const router = useRouter();

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

  const handleDiscordLogin = async () => {
    try {
      await signIn("discord", {
        callbackUrl: "/admin",
        redirect: true
      });
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  if (isAppLoading) return <UnifiedLoader onFinished={() => setIsAppLoading(false)} />;

  return (
    <main className={styles.mainContainer}>
      <div className={styles.backgroundLayer}>
        <div className={styles.radialGradient} />
        <div className={styles.texturePattern} />
        <div className={styles.gridPattern} />
        <div className={styles.scanningLine} />
      </div>

      <div className={styles.shellFrame}>
        <section className={styles.leftPanel}>
          <div className={styles.brandLine}>
            <span className={styles.brandMark} />
            <span className={styles.brandText}>CONSTANCY ACCESS</span>
          </div>
          <div className={styles.leftHeader}>
            <span className={styles.accessKicker}>
              <Lock size={12} />
              AUTH SERVICE
            </span>
            <h1 className={styles.heroTitle}>ADMIN ACCESS</h1>
            <p className={styles.heroDesc}>
              Command-grade authentication to secure operational oversight and response routing.
            </p>
          </div>

          <div className={styles.statStack}>
            <div className={styles.statItem}>
              <ShieldCheck size={18} />
              <div>
                <div className={styles.statLabel}>Integrity</div>
                <div className={styles.statValue}>ENCRYPTED_PATH</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <Cpu size={18} />
              <div>
                <div className={styles.statLabel}>Core</div>
                <div className={styles.statValue}>V5.2.0-SECURE</div>
              </div>
            </div>
            <div className={styles.statItem}>
              <Globe size={18} />
              <div>
                <div className={styles.statLabel}>Region</div>
                <div className={styles.statValue}>STATION-01</div>
              </div>
            </div>
          </div>

          <div className={styles.accessTags}>
            <span className={styles.tagChip}>MFA REQUIRED</span>
            <span className={styles.tagChip}>PROTOCOL v6.2</span>
            <span className={styles.tagChip}>AUDIT ENABLED</span>
          </div>

          <div className={styles.leftFooter}>
            Authorized personnel only // Unauthorized access will be logged
          </div>
        </section>

        <section className={styles.rightPanel}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <div className={styles.iconWrapperRelative}>
                <div className={styles.iconGlow} />
                <div className={styles.iconFrame}>
                  <ShieldCheck size={42} className={styles.shieldIcon} />
                  <div className={styles.scanOverlay} />
                </div>
              </div>
              <div>
                <div className={styles.loginTitle}>Identification Required</div>
                <div className={styles.loginDesc}>
                  Use secure provider to authenticate and unlock admin modules.
                </div>
              </div>
            </div>

            <div className={styles.loginButtons}>
              <button
                onClick={handleDiscordLogin}
                className={`${styles.loginButton} group`}
                type="button"
              >
                <span className={styles.buttonText}>
                  Verify With Discord <Cpu size={16} className={styles.cpuIcon} />
                </span>
                <div className={styles.buttonShine} />
              </button>
            </div>

            <div className={styles.footerIcons}>
              {[Globe, Lock, ShieldCheck].map((Icon, i) => (
                <div key={i} className={styles.footerIconItem}>
                  <Icon size={14} />
                  <div className={styles.dot} />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.statusPills}>
            <span className={styles.statusPill}>SECURED</span>
            <span className={styles.statusPill}>NODE: TOKYO-7</span>
          </div>
        </section>
      </div>
    </main>
  );
}
