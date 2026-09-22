"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function CurrencySelect({
  value,
  onChange,
  className,
  fullWidth = false,
}: {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
  className?: string;
  fullWidth?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = CURRENCIES.find((c) => c.code === value) ?? CURRENCIES[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", fullWidth && "w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center justify-between gap-2 rounded-full border border-white/10 bg-black px-3 py-2 text-xs text-white",
          fullWidth && "w-full rounded-xl px-4 py-3 text-sm",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>
          {current.flag} {current.code}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-white/60 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          role="listbox"
          className="absolute right-0 z-[80] mt-2 min-w-full overflow-hidden rounded-2xl border border-white/10 bg-black p-1 shadow-2xl"
        >
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={c.code === value}
              onClick={() => {
                onChange(c.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-white/10",
                c.code === value && "bg-smg/20 text-orange-200",
              )}
            >
              <span>{c.flag}</span>
              <span>{c.code}</span>
              <span className="ml-auto text-xs text-white/40">{c.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
