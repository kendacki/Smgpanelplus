"use client";

import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui";

const field =
  "w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-smg focus:ring-2 focus:ring-smg/30";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteShell>
      <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
        <p className="text-[11px] tracking-[0.22em] text-smg">SUPPORT</p>
        <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Contact us</h1>
        <p className="mt-1 text-sm text-white/55">We typically reply within a few hours.</p>

        <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/55 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)] ring-1 ring-smg/20 backdrop-blur-xl sm:p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-smg to-transparent" />
          {sent ? (
            <div className="px-2 py-8 text-center">
              <p className="font-display text-lg font-semibold">Message received</p>
              <p className="mt-1 text-sm text-white/60">We will get back to you shortly.</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-sm font-medium text-smg hover:text-gold"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-medium tracking-wide text-white/50">Name</span>
                  <input required name="name" autoComplete="name" placeholder="Your name" className={field} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-medium tracking-wide text-white/50">Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    className={field}
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-[11px] font-medium tracking-wide text-white/50">Message</span>
                <textarea
                  required
                  name="message"
                  rows={3}
                  placeholder="How can we help?"
                  className={`${field} resize-none`}
                />
              </label>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-white/40">Orders, billing, or the child panel.</p>
                <Button type="submit" className="w-full shrink-0 px-5 py-2 sm:w-auto">
                  Send
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
