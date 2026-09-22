import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-5 md:px-6">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-white/55">
            SMG Panel is the affordable SMM panel for African creators, brands and resellers.
            Fast delivery, local payments, and a full API.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-smg">SERVICES</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/services">All Services</Link>
            </li>
            <li>
              <Link href="/services?cat=instagram">Instagram Followers</Link>
            </li>
            <li>
              <Link href="/services?cat=tiktok">TikTok Likes</Link>
            </li>
            <li>
              <Link href="/services?cat=twitter">Twitter Followers</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-smg">RESOURCES</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/api-docs">API</Link>
            </li>
            <li>
              <Link href="/child-panel">Child Panel</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-smg">COMPANY</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/8 py-6 text-center text-xs text-white/40">
        © 2024 - {new Date().getFullYear()} SMG Panel. All rights reserved.
      </div>
    </footer>
  );
}
