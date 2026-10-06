"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { SessionUser } from "@/lib/auth";
import { PANEL_CURRENCY, type CurrencyCode } from "@/lib/currency";

type SessionState = SessionUser | null;

type AppContextValue = {
  session: SessionState;
  setSession: (session: SessionState) => void;
  currency: CurrencyCode;
};

const AppContext = createContext<AppContextValue | null>(null);

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionState;
}) {
  const [currentSession, setSession] = useState<SessionState>(session);

  useEffect(() => {
    setSession(session);
  }, [session]);

  const value = useMemo(
    () => ({ session: currentSession, setSession, currency: PANEL_CURRENCY }),
    [currentSession],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within Providers");
  return ctx;
}
