"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "./ui";
import { useApp } from "./providers";
import { CurrencySelect } from "./currency-select";

const trending = [
  { href: "/services?cat=instagram", label: "Buy Instagram Followers" },
  { href: "/services?cat=tiktok", label: "Organic TikTok Likes" },
  { href: "/services?cat=twitter", label: "Real Twitter Followers" },
];

export function Header() {
  const { session, currency, setCurrency } = useApp();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Logo size="header" />
        <nav className="hidden items-center gap-6 text-sm text-white/80 lg:flex">
          <Link href="/services" className="hover:text-white">
            Services
          </Link>
          <div className="group relative">
            <button className="inline-flex items-center gap-1 hover:text-white">
              Trending <ChevronDown className="h-4 w-4" />
            </button>
            <div className="invisible absolute left-0 top-full w-64 rounded-2xl border border-white/10 bg-[#111] p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
              {trending.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
          <Link href="/child-panel" className="hover:text-white">
            Child Panel
          </Link>
          <Link href="/api-docs" className="hover:text-white">
            API
          </Link>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <CurrencySelect value={currency} onChange={setCurrency} />
          {session ? (
            <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
          ) : (
            <>
              <Link href="/login" className="text-sm text-white/80 hover:text-white">
                Sign In
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <div className="space-y-3 border-t border-white/8 px-4 py-4 lg:hidden">
          <Link href="/services" onClick={() => setOpen(false)} className="block">
            Services
          </Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="block">
            Blog
          </Link>
          <Link href="/child-panel" onClick={() => setOpen(false)} className="block">
            Child Panel
          </Link>
          <CurrencySelect value={currency} onChange={setCurrency} fullWidth />
          <div className="flex gap-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
