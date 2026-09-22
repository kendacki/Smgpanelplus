"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, LayoutDashboard, ListOrdered, Users } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ListOrdered },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#070707]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/8 bg-black p-5 lg:block">
        <Logo compact />
        <nav className="mt-8 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5",
                pathname === link.href && "bg-smg/15 text-white",
              )}
            >
              <link.icon className="h-4 w-4 text-smg" />
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-8 flex items-center gap-2 text-sm text-white/50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to panel
        </button>
      </aside>
      <div className="lg:pl-64">
        <header className="flex items-center justify-between border-b border-white/8 px-4 py-4 lg:hidden">
          <Logo compact />
          <div className="flex gap-3 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        </header>
        <div className="px-4 py-8 md:px-8">{children}</div>
      </div>
    </div>
  );
}
