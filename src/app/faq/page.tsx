import { SiteShell } from "@/components/site-shell";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "FAQ" };

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="font-display text-4xl">FAQ</h1>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.id} className="glass rounded-2xl px-5 py-4">
              <summary className="cursor-pointer font-medium">{faq.question}</summary>
              <p className="mt-2 text-sm text-white/60">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
