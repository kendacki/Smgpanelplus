"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Coins, CreditCard, Smartphone, Sparkles, WalletCards } from "lucide-react";
import { Alert, Button, Card, EmptyState, Input, Spinner } from "@/components/ui";
import { cn, paymentStatusLabel } from "@/lib/utils";
import { formatMoney, formatPay, MIN_TOPUP_USDT, type PayCurrency } from "@/lib/currency";
import type { PaymentMethod } from "@/lib/payments";

type Payment = {
  id: string;
  amount: number;
  paidAmount: number;
  currency: string;
  method: string;
  status: string;
  reference: string;
  note: string | null;
  metadata: string | null;
  createdAt: string;
};

type CryptoCheckout = {
  reference: string;
  address: string;
  payAmount: string;
  network: string;
  expiresAt: string;
};

const ICONS: Record<string, typeof Coins> = {
  crypto: Coins,
  paystack: CreditCard,
  flutterwave: WalletCards,
  bank_ngn: Building2,
  mpesa: Smartphone,
  momo: Smartphone,
  demo: Sparkles,
};

const PRESETS_USDT = [5, 10, 25, 50];

export function AddFundsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [rates, setRates] = useState<Record<PayCurrency, number>>({
    USDT: 1,
    NGN: 1550,
    GHS: 12.2,
    KES: 129,
  });
  const [method, setMethod] = useState("crypto");
  const [currency, setCurrency] = useState<PayCurrency>("USDT");
  const [amount, setAmount] = useState(10);
  const [note, setNote] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkout, setCheckout] = useState<CryptoCheckout | null>(null);
  const [remaining, setRemaining] = useState(0);

  const selected = methods.find((item) => item.id === method);
  const credit =
    amount > 0 && rates[currency] ? Number((amount / rates[currency]).toFixed(4)) : 0;

  const visibleMethods = useMemo(
    () => methods.filter((item) => item.kind !== "gateway" || item.live),
    [methods],
  );

  async function load() {
    const res = await fetch("/api/wallet");
    const data = await res.json();
    setPayments(data.payments || []);
    setBalance(data.balance || 0);
    if (data.rates) setRates(data.rates);
    if (Array.isArray(data.methods) && data.methods.length) {
      setMethods(data.methods);
    }
    const pending = (data.payments || []).find(
      (item: Payment) => item.method === "crypto" && item.status === "PENDING" && item.metadata,
    ) as Payment | undefined;
    setCheckout((current) => {
      if (!pending?.metadata) return current;
      try {
        const saved = JSON.parse(pending.metadata) as CryptoCheckout;
        if (!saved.expiresAt || new Date(saved.expiresAt).getTime() <= Date.now()) return current;
        if (current) return current;
        return { ...saved, reference: pending.reference };
      } catch {
        return current;
      }
    });
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const reference =
      searchParams.get("reference") || searchParams.get("trxref") || searchParams.get("tx_ref");
    if (!reference) return;
    setChecking(true);
    fetch(`/api/wallet/verify?reference=${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setMessage(data.message || "Payment updated.");
        return load();
      })
      .catch(() => setError("Could not verify this payment."))
      .finally(() => {
        setChecking(false);
        router.replace("/dashboard/add-funds");
      });
  }, [searchParams, router]);

  useEffect(() => {
    if (!visibleMethods.length) return;
    if (!visibleMethods.some((item) => item.id === method)) {
      setMethod(visibleMethods[0].id);
    }
  }, [visibleMethods, method]);

  useEffect(() => {
    if (!selected) return;
    if (!selected.currencies.includes(currency)) {
      setCurrency(selected.currencies[0]);
    }
  }, [selected, currency]);

  useEffect(() => {
    if (!checkout) return;
    const tick = () => setRemaining(Math.max(0, new Date(checkout.expiresAt).getTime() - Date.now()));
    tick();
    const clock = window.setInterval(tick, 1000);
    return () => window.clearInterval(clock);
  }, [checkout]);

  useEffect(() => {
    if (!checkout) return;
    const reference = checkout.reference;
    let stopped = false;
    async function poll() {
      const res = await fetch(`/api/wallet/verify?reference=${encodeURIComponent(reference)}`);
      const data = await res.json();
      if (stopped) return;
      if (data.expired) {
        setCheckout(null);
        setError(data.message || "Payment window expired.");
        await load();
        return;
      }
      if (data.payment?.status === "COMPLETED") {
        setCheckout(null);
        setMessage(data.message || "Wallet credited in USDT.");
        await load();
      }
    }
    void poll();
    const timer = window.setInterval(poll, 15000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [checkout]);

  function applyPreset(usdt: number) {
    const rate = rates[currency] || 1;
    const digits = currency === "USDT" ? 4 : 2;
    setAmount(Number((usdt * rate).toFixed(digits)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          method,
          currency,
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment failed");
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      if (data.crypto?.address) {
        setCheckout({
          reference: data.payment.reference,
          address: data.crypto.address,
          payAmount: data.crypto.payAmount,
          network: data.crypto.network,
          expiresAt: data.crypto.expiresAt,
        });
        setMessage(data.message);
      } else {
        setMessage(`${data.message} Reference: ${data.payment.reference}`);
      }
      setNote("");
      await load();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const submitLabel =
    selected?.kind === "gateway"
      ? `Continue to ${selected.name}`
      : selected?.id === "crypto"
        ? "Start USDT payment"
        : selected?.id === "demo"
          ? "Credit wallet"
          : "Submit payment";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <h1 className="font-display text-3xl">Add funds</h1>
        <p className="mt-1 text-sm text-white/50">
          Pay in NGN, GHS, KES or USDT. Orders still spend from your{" "}
          <span className="text-smg">{formatMoney(balance)}</span> wallet.
        </p>
        <Card className="mt-6">
          <form onSubmit={submit} className="space-y-5">
            {error ? <Alert>{error}</Alert> : null}
            {message ? <Alert tone="success">{message}</Alert> : null}
            {checking ? <Alert tone="info">Checking your payment…</Alert> : null}
            {checkout ? (
              <UsdtCheckoutPanel
                checkout={checkout}
                remaining={remaining}
                onCheck={async () => {
                  setChecking(true);
                  try {
                    const res = await fetch(
                      `/api/wallet/verify?reference=${encodeURIComponent(checkout.reference)}`,
                    );
                    const data = await res.json();
                    if (data.expired) {
                      setCheckout(null);
                      setError(data.message || "Payment window expired.");
                    } else if (data.payment?.status === "COMPLETED") {
                      setCheckout(null);
                      setMessage(data.message || "Wallet credited in USDT.");
                    } else if (data.error) {
                      setError(data.error);
                    } else {
                      setMessage(data.message || "Still waiting for the transfer.");
                    }
                    await load();
                  } finally {
                    setChecking(false);
                  }
                }}
              />
            ) : null}

            <div>
              <p className="mb-2 text-xs text-white/50">Payment method</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {visibleMethods.map((item) => {
                  const Icon = ICONS[item.id] ?? Coins;
                  const active = item.id === method;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMethod(item.id);
                        setCurrency(item.currencies[0]);
                        const rate = rates[item.currencies[0]] || 1;
                        setAmount(Number((10 * rate).toFixed(item.currencies[0] === "USDT" ? 4 : 2)));
                      }}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-left transition",
                        active
                          ? "border-smg bg-smg/10"
                          : "border-white/10 bg-black/30 hover:border-white/25",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-smg" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </span>
                      <span className="mt-1 block text-xs text-white/45">{item.region}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-white/45">{selected?.description}</p>
            </div>

            {selected && selected.currencies.length > 1 ? (
              <div className="flex flex-wrap gap-2">
                {selected.currencies.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      const nextRate = rates[code] || 1;
                      setCurrency(code);
                      setAmount(Number((credit * nextRate).toFixed(code === "USDT" ? 4 : 2)));
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs",
                      currency === code
                        ? "border-smg bg-smg text-black"
                        : "border-white/15 text-white/70",
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
            ) : null}

            <div>
              <label className="mb-1 block text-xs text-white/50">You pay ({currency})</label>
              <Input
                type="number"
                min={0}
                step={currency === "USDT" ? "0.01" : "1"}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESETS_USDT.map((usdt) => (
                  <button
                    key={usdt}
                    type="button"
                    onClick={() => applyPreset(usdt)}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 hover:border-smg"
                  >
                    {usdt} USDT
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-smg/20 bg-smg/10 p-4 text-sm">
              <p className="text-orange-100">
                Wallet credit: <span className="font-semibold">{formatMoney(credit)}</span>
              </p>
              <p className="mt-1 text-xs text-white/55">
                You pay {formatPay(amount, currency)}. Minimum {MIN_TOPUP_USDT} USDT.
              </p>
              {selected?.instructions ? (
                <p className="mt-3 whitespace-pre-wrap text-xs text-white/70">{selected.instructions}</p>
              ) : null}
            </div>

            {selected?.kind === "manual" ? (
              <div>
                <label className="mb-1 block text-xs text-white/50">
                  Sender name or transaction ID (optional)
                </label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Helps us match your payment faster"
                />
              </div>
            ) : null}

            <Button type="submit" disabled={loading || credit < MIN_TOPUP_USDT}>
              {loading ? <Spinner /> : null} {submitLabel}
            </Button>
          </form>
        </Card>
      </div>
      <div>
        <h2 className="font-semibold">Payment history</h2>
        <p className="mt-1 text-xs text-white/45">
          Local payments are converted to USDT at the rate shown when you submit.
        </p>
        <div className="mt-4 overflow-x-auto rounded-3xl border border-white/10">
          {payments.length === 0 ? (
            <div className="p-4">
              <EmptyState title="No payments" body="Fund with Naira, cedis, shillings or USDT to start ordering." />
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-white/50">
                <tr>
                  <th className="px-3 py-2 text-left">Ref</th>
                  <th className="px-3 py-2 text-left">Paid</th>
                  <th className="px-3 py-2 text-left">Credit</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-white/8">
                    <td className="px-3 py-2">
                      <p className="font-mono text-xs">{p.reference}</p>
                      <p className="text-xs text-white/40">{p.method}</p>
                    </td>
                    <td className="px-3 py-2">
                      {formatPay(p.paidAmount || p.amount, p.currency)}
                    </td>
                    <td className="px-3 py-2">{formatMoney(p.amount)}</td>
                    <td className="px-3 py-2">{paymentStatusLabel(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function UsdtCheckoutPanel({
  checkout,
  remaining,
  onCheck,
}: {
  checkout: CryptoCheckout;
  remaining: number;
  onCheck: () => void;
}) {
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const clock = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-smg/30 bg-black p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">USDT payment</p>
        <p className="font-mono text-lg text-smg">{clock}</p>
      </div>
      <ol className="space-y-3 text-sm">
        <li>
          <p className="text-xs text-white/45">1. Send this exact amount</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="font-mono text-base">{checkout.payAmount} USDT</span>
            <button type="button" className="text-xs text-smg" onClick={() => copy(checkout.payAmount)}>
              Copy
            </button>
          </div>
        </li>
        <li>
          <p className="text-xs text-white/45">2. Network</p>
          <p className="mt-1">{checkout.network}</p>
        </li>
        <li>
          <p className="text-xs text-white/45">3. Receiving wallet</p>
          <div className="mt-1 flex items-start justify-between gap-2">
            <span className="break-all font-mono text-xs">{checkout.address}</span>
            <button type="button" className="shrink-0 text-xs text-smg" onClick={() => copy(checkout.address)}>
              Copy
            </button>
          </div>
        </li>
      </ol>
      <p className="text-xs text-white/50">
        We check the transfer automatically. A different amount or network will not credit this payment.
      </p>
      <Button type="button" variant="outline" onClick={onCheck}>
        Check payment now
      </Button>
    </div>
  );
}
