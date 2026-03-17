"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UnifiedLoader from "@/components/loading/LoadingScreen";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await fetch("/api/admin/logout", {
          method: "POST",
          cache: "no-store",
        });
      } finally {
        router.replace("/");
        router.refresh();
      }
    };
    doLogout();
  }, [router]);

  return <UnifiedLoader onFinished={() => null} />;
}
