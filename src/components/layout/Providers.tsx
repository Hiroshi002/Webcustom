"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const imageUrl = `/api/background?image=1&t=${Date.now()}`;
    document.documentElement.style.setProperty("--random-bg-url", `url("${imageUrl}")`);
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
