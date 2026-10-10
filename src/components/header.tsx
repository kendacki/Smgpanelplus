"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "./ui";
import { useApp } from "./providers";

const trending = [
  { href: "/services?cat=instagram", label: "Buy Instagram Followers" },
  { href: "/services?cat=tiktok", label: "Organic TikTok Likes" },
  { href: "/services?cat=twitter", label: "Real Twitter Followers" },
];

export function Header() {
  const { session } = useApp();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
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
          <Link href="/faq" className="hover:text-white">
            FAQ
          </Link>
          <Link href="/child-panel" className="hover:text-white">
            Resellers
          </Link>
          <Link href="/api-docs" className="hover:text-white">
            API
          </Link>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {session ? (
            <span className="rounded-full border border-white/10 bg-black px-3 py-2 text-xs text-white/80">
              NGN · GHS · KES · USDT
            </span>
          ) : null}
          {session ? (
            <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
          ) : (
            <>
              <Link href="/login" className="text-sm text-white/80 hover:text-white">
                Sign In
              </Link>
              <Button href="/register">Sign Up</Button>
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
          <Link href="/faq" onClick={() => setOpen(false)} className="block">
            FAQ
          </Link>
          <Link href="/child-panel" onClick={() => setOpen(false)} className="block">
            Resellers
          </Link>
          <Link href="/api-docs" onClick={() => setOpen(false)} className="block">
            API
          </Link>
          <div className="flex gap-2">
            <Button href="/login" variant="outline" className="w-full flex-1" onClick={() => setOpen(false)}>
              Sign In
            </Button>
            <Button href="/register" className="w-full flex-1" onClick={() => setOpen(false)}>
              Sign Up
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
