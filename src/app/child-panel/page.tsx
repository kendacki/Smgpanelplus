import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { Button, Card } from "@/components/ui";
import { ResellerArt } from "@/components/illustrations";

export const metadata = { title: "Child Panel" };

export default function ChildPanelPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="text-smg">Resellers</p>
        <h1 className="mt-2 font-display text-4xl">Sell SMG under your brand</h1>
        <p className="mt-4 max-w-2xl text-white/65">
          Child panel resale: your domain, your rates, our fulfillment. Keep the margin.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              kind: "brand" as const,
              title: "Your brand",
              body: "Your logo and pricing. SMG delivers the orders.",
            },
            {
              kind: "api" as const,
              title: "API first",
              body: "Standard add, status, services and balance calls.",
            },
            {
              kind: "money" as const,
              title: "Your checkout",
              body: "Your users pay in NGN, GHS, KES or USDT. You keep the margin.",
            },
          ].map((item) => (
            <Card key={item.title} className="lift">
              <ResellerArt kind={item.kind} />
              <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/60">{item.body}</p>
            </Card>
          ))}
        </div>
        <Link href="/register" className="mt-10 inline-block">
          <Button>Become a reseller</Button>
        </Link>
      </div>
    </SiteShell>
  );
}
