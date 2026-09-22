"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { SessionUser } from "@/lib/auth";
import { type CurrencyCode, getCurrency } from "@/lib/currency";

type SessionState = SessionUser | null;

type AppContextValue = {
  session: SessionState;
  setSession: (session: SessionState) => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
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
  const [currency, setCurrencyState] = useState<CurrencyCode>(
    getCurrency(session?.currency ?? "NGN"),
  );

  useEffect(() => {
    setSession(session);
    if (session?.currency) setCurrencyState(getCurrency(session.currency));
  }, [session]);

  useEffect(() => {
    const stored = window.localStorage.getItem("smg-currency");
    if (stored && !session) setCurrencyState(getCurrency(stored));
  }, [session]);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    window.localStorage.setItem("smg-currency", code);
  };

  const value = useMemo(
    () => ({ session: currentSession, setSession, currency, setCurrency }),
    [currentSession, currency],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within Providers");
  return ctx;
}
