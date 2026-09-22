import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { Button, Card } from "@/components/ui";

export const metadata = { title: "Child Panel" };

export default function ChildPanelPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="text-smg">Resellers</p>
        <h1 className="mt-2 font-display text-4xl">Run your own SMM panel</h1>
        <p className="mt-4 max-w-2xl text-white/65">
          Child Panel lets you resell SMG services under your brand. Connect via API, set your own
          rates, and keep the margin.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Your brand", "Use your domain, logo and colors while SMG fulfills the orders."],
            ["API first", "Standard add / status / services / balance endpoints."],
            ["African payments", "Keep collecting NGN, GHS or KES from your own users."],
          ].map(([title, body]) => (
            <Card key={title}>
              <h3 className="text-xl font-semibold">{title}</h3>
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
