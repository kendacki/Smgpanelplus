import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { Button, Card } from "@/components/ui";
import { IsoCube } from "@/components/illustrations";

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
            ["Your brand", "Your logo and pricing. SMG delivers the orders."],
            ["API first", "Standard add, status, services and balance calls."],
            ["Local money", "Your users pay in NGN, GHS or KES."],
          ].map(([title, body]) => (
            <Card key={title} className="lift">
              <IsoCube title={title} />
              <h3 className="mt-2 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-white/60">{body}</p>
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
