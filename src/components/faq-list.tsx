"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const GROUPS = ["All", "Orders", "Payments", "Safety", "Resellers"] as const;

function groupOf(question: string) {
  const value = question.toLowerCase();
  if (value.includes("pay") || value.includes("fund") || value.includes("usdt")) return "Payments";
  if (value.includes("api") || value.includes("resell")) return "Resellers";
  if (value.includes("safe") || value.includes("password") || value.includes("account")) return "Safety";
  return "Orders";
}

export function FaqList({
  faqs,
  showFilters = false,
}: {
  faqs: FaqItem[];
  showFilters?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof GROUPS)[number]>("All");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      if (group !== "All" && groupOf(faq.question) !== group) return false;
      if (!needle) return true;
      return faq.question.toLowerCase().includes(needle) || faq.answer.toLowerCase().includes(needle);
    });
  }, [faqs, query, group]);

  return (
    <div>
      {showFilters ? (
        <div className="mb-6 space-y-4">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
            <Search className="h-4 w-4 text-white/40" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {GROUPS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setGroup(item)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition",
                  group === item
                    ? "border-transparent bg-smg text-black"
                    : "border-white/10 text-white/70 hover:border-smg/50",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center text-sm text-white/50">
          No questions match that search.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((faq, index) => {
            const open = openId === faq.id;
            return (
              <article
                key={faq.id}
                className={cn(
                  "faq-in glass overflow-hidden rounded-2xl transition-colors",
                  open && "border-smg/40",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : faq.id)}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-smg/15 font-mono text-xs text-smg">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-medium">{faq.question}</span>
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 text-white/50 transition-transform duration-300", open && "rotate-180 text-smg")}
                  />
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-white/65">{faq.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {showFilters ? (
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium">Still need a hand?</p>
            <p className="mt-1 text-sm text-white/50">Send the order ID and we will look it up.</p>
          </div>
          <Link href="/contact" className="rounded-full bg-smg px-5 py-2 text-sm font-semibold text-black">
            Contact support
          </Link>
        </div>
      ) : null}
    </div>
  );
}
