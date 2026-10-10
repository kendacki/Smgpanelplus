"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Code2,
  CreditCard,
  Headphones,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Settings,
  Shield,
  ShoppingCart,
  Layers3,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { useApp } from "@/components/providers";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "New Order", icon: ShoppingCart },
  { href: "/dashboard/mass-order", label: "Mass Order", icon: Layers3 },
  { href: "/dashboard/orders", label: "Orders", icon: ListOrdered },
  { href: "/dashboard/services", label: "Services", icon: LayoutDashboard },
  { href: "/dashboard/add-funds", label: "Add Funds", icon: Wallet },
  { href: "/dashboard/tickets", label: "Tickets", icon: Headphones },
  { href: "/dashboard/api", label: "API", icon: Code2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

type Me = {
  username: string;
  role: string;
  balance: number;
  currency: string;
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setSession } = useApp();
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function loadMe() {
    const res = await fetch("/api/auth/me");
    if (!res.ok) {
      setError("Session expired");
      router.push("/login");
      return;
    }
    const data = await res.json();
    setMe(data.user);
    setSession(data.user);
  }

  useEffect(() => {
    loadMe();
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#070707]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-white/8 bg-black p-5 transition lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <Logo compact />
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5",
                  active && "bg-smg/15 text-white",
                )}
              >
                <link.icon className={cn("h-4 w-4", active && "text-smg")} />
                {link.label}
              </Link>
            );
          })}
          {me?.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="mt-4 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-orange-200 hover:bg-white/5"
            >
              <Shield className="h-4 w-4" /> Admin
            </Link>
          ) : null}
        </nav>
        <button
          onClick={logout}
          className="mt-8 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm text-white/50 hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      <div className="pb-20 lg:pb-0 lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-white/8 bg-black/80 px-3 py-2.5 backdrop-blur-xl sm:px-4 sm:py-3 md:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex min-w-0 items-center gap-2">
            <div className="truncate rounded-full border border-smg/30 bg-smg/10 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
              <CreditCard className="mr-1.5 inline h-3.5 w-3.5 text-smg sm:mr-2 sm:h-4 sm:w-4" />
              {me ? formatMoney(me.balance) : "..."}
            </div>
            <div className="hidden max-w-[8rem] truncate rounded-full bg-white/5 px-3 py-1.5 text-xs sm:block sm:px-4 sm:py-2 sm:text-sm">
              {me?.username ?? "…"}
            </div>
          </div>
        </header>
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-white/10 bg-black lg:hidden">
          {[
            { href: "/dashboard", label: "Order", icon: ShoppingCart },
            { href: "/dashboard/orders", label: "Orders", icon: ListOrdered },
            { href: "/dashboard/add-funds", label: "Funds", icon: Wallet },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-[11px] text-white/55",
                pathname === link.href && "text-smg",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-1 py-2 text-[11px] text-white/55"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
        </nav>
        <div className="px-3 py-5 sm:px-4 sm:py-8 md:px-8">
          {error ? <p className="mb-4 text-sm text-red-300">{error}</p> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
