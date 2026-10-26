"use client";

import { useEffect, useState } from "react";

const RESEND_COOLDOWN_MS = 30_000;
const CODE_LIFETIME_MS = 10 * 60_000;

type CodeDeadlines = {
  resendAvailableAt: number;
  codeExpiresAt: number;
};

function storageKey(emailAddress: string) {
  return `vendor-sign-up-code:${emailAddress.trim().toLowerCase()}`;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
}

export function useEmailCodeTimer(emailAddress: string, enabled: boolean) {
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState<number | null>(null);
  // A stable initial value keeps the Client Component prerender deterministic.
  const [now, setNow] = useState(0);

  const resendSeconds = resendAvailableAt
    ? Math.max(0, Math.ceil((resendAvailableAt - now) / 1000))
    : 0;
  const expirySeconds = codeExpiresAt
    ? Math.max(0, Math.ceil((codeExpiresAt - now) / 1000))
    : 0;

  function start() {
    const timestamp = Date.now();
    const deadlines = {
      resendAvailableAt: timestamp + RESEND_COOLDOWN_MS,
      codeExpiresAt: timestamp + CODE_LIFETIME_MS,
    };

    setNow(timestamp);
    setResendAvailableAt(deadlines.resendAvailableAt);
    setCodeExpiresAt(deadlines.codeExpiresAt);
    try {
      sessionStorage.setItem(storageKey(emailAddress), JSON.stringify(deadlines));
    } catch {
      // In-memory deadlines still work when browser storage is unavailable.
    }
  }

  function clear() {
    try {
      if (emailAddress) sessionStorage.removeItem(storageKey(emailAddress));
    } catch {
      // The timers are cleared in memory even if browser storage is unavailable.
    }
    setResendAvailableAt(null);
    setCodeExpiresAt(null);
  }

  useEffect(() => {
    if (!enabled) return;
    setNow(Date.now());

    if (codeExpiresAt !== null || !emailAddress) return;
    try {
      const stored = sessionStorage.getItem(storageKey(emailAddress));
      if (!stored) return;

      const deadlines = JSON.parse(stored) as Partial<CodeDeadlines>;
      if (typeof deadlines.codeExpiresAt === "number") {
        setCodeExpiresAt(deadlines.codeExpiresAt);
        setResendAvailableAt(deadlines.resendAvailableAt ?? null);
      }
    } catch {
      // Resending remains available to establish a fresh verification window.
    }
  }, [enabled, codeExpiresAt, emailAddress]);

  useEffect(() => {
    if (!enabled || !codeExpiresAt || codeExpiresAt <= Date.now()) return;

    const interval = window.setInterval(() => {
      const timestamp = Date.now();
      setNow(timestamp);
      if (timestamp >= codeExpiresAt) window.clearInterval(interval);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [enabled, codeExpiresAt]);

  return {
    resendSeconds,
    expirySeconds,
    formatTime,
    start,
    clear,
  };
}
