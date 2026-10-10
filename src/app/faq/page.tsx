import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { FaqList } from "@/components/faq-list";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "FAQ" };

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, question: true, answer: true },
  });

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-sm tracking-[0.22em] text-smg">HELP</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">
          Questions, <span className="gradient-text">answered</span>
        </h1>
        <p className="mt-4 max-w-xl text-white/60">
          Orders, payments, refills, and the reseller API. Search or pick a topic.
        </p>
        <p className="mt-6 text-sm text-white/40">{faqs.length} answers</p>
        <div className="mt-6">
          <FaqList faqs={faqs} showFilters />
        </div>
        <p className="mt-8 text-sm text-white/45">
          Ready to start?{" "}
          <Link href="/register" className="text-smg">
            Create an account
          </Link>{" "}
          or{" "}
          <Link href="/services" className="text-smg">
            browse services
          </Link>
          .
        </p>
      </div>
    </SiteShell>
  );
}
