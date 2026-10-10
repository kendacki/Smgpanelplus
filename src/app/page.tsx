import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FaqList } from "@/components/faq-list";
import { Button, Card } from "@/components/ui";
import { VisibilityArt, PlatformMark, Flag3D, ProductArt, FeatureArt } from "@/components/illustrations";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";

const steps = [
  { n: "1", title: "Create an account", body: "Sign up in under a minute." },
  { n: "2", title: "Fund your wallet", body: "Pay in NGN, GHS, KES or USDT." },
  { n: "3", title: "Pick a service", body: "Followers, likes, views or comments." },
  { n: "4", title: "Paste the link", body: "We start delivery from the dashboard." },
];

const reviews = [
  {
    name: "Kunle",
    place: "Lagos",
    quote: "Local comments made my shop page feel alive. Inquiries went up the same week.",
  },
  {
    name: "Amani",
    place: "Nairobi",
    quote: "TikTok lives used to be quiet. SMG comments made the room feel full.",
  },
  {
    name: "Akosua",
    place: "Accra",
    quote: "My thrift page gained real momentum in two weeks. Pricing was honest.",
  },
];

export default async function HomePage() {
  const [orderCount, userCount, cheapest, faqs] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.service.findFirst({ orderBy: { rate: "asc" } }),
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" }, take: 4 }),
  ]);

  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="mesh absolute inset-0 opacity-30" />
        <div className="mx-auto grid max-w-7xl items-end gap-6 lg:grid-cols-2">
          <div className="px-4 pb-12 pt-16 md:px-6 lg:pb-20 lg:pt-24">
            <h1 className="font-display text-4xl font-semibold leading-[1.05] md:text-6xl">
              Grow your audience across the <span className="gradient-text">World</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/65">
              Followers, likes and views for Instagram, TikTok, YouTube and more. Pay in Naira,
              cedis, shillings or USDT — then track every order in one dashboard.
            </p>
            <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3">
              <Button href="/register" className="px-8 py-3 text-base">
                Start growing
              </Button>
              <Button href="/services" variant="outline">
                Browse services
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end lg:pr-8">
            <Image
              src="/hero-visor.png"
              alt="Person looking upward in a glowing visor"
              width={742}
              height={880}
              priority
              className="h-auto w-full max-w-[340px] object-contain object-bottom sm:max-w-[420px] lg:max-w-[460px] [mask-image:linear-gradient(to_bottom,black_76%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_76%,transparent_100%)]"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-panel/80">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3 md:px-6">
          {[
            { title: "Nigeria" as const, body: "Creators and shops across Nigeria. Pay in Naira or USDT." },
            { title: "Ghana" as const, body: "Ghanaian pages and brands. Pay in cedis or USDT." },
            { title: "Kenya" as const, body: "Kenyan creators and resellers. Pay in shillings or USDT." },
          ].map((item) => (
            <div key={item.title} className="perspective-scene flex items-center gap-4 rounded-3xl border border-white/8 bg-black/30 p-5">
              <Flag3D country={item.title} />
              <div>
                <h3 className="font-display text-xl">{item.title}</h3>
                <p className="mt-1 text-sm text-white/55">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <p className="text-center text-xs tracking-[0.28em] text-smg">WHAT YOU CAN RUN</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-3xl font-semibold md:text-5xl">
          One panel for orders, bulk work and resale
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Single order",
              body: "Boost one post or profile in a few clicks.",
              href: "/dashboard",
              kind: "single" as const,
            },
            {
              title: "Mass order",
              body: "Paste many links and launch campaigns together.",
              href: "/dashboard/mass-order",
              kind: "mass" as const,
            },
            {
              title: "Child panel",
              body: "Resell SMG under your brand with the API.",
              href: "/child-panel",
              kind: "panel" as const,
            },
          ].map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="lift h-full">
                <ProductArt kind={item.kind} />
                <h3 className="mt-2 font-display text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.body}</p>
                <p className="mt-5 text-sm font-medium text-smg">Open →</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#1a0e04] via-black to-[#0b0b10]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-6">
          <div>
            <p className="text-smg">Built for African creators</p>
            <h2 className="mt-2 font-display text-4xl font-semibold">Visibility without the guesswork</h2>
            <p className="mt-4 text-white/65">
              Put distribution behind content that already works. SMG is for shops, musicians and
              pages that need reach — not noise.
            </p>
            <ul className="mt-6 space-y-3 text-white/80">
              {[
                "Packages aimed at Nigerian, Ghanaian and Kenyan audiences",
                "Instagram, TikTok, YouTube, Facebook, Telegram and Spotify",
                "We never ask for your social password",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-smg" /> {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <VisibilityArt />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid gap-4 rounded-3xl border border-smg/25 bg-smg/10 p-8 text-center md:grid-cols-3">
          <div>
            <p className="font-display text-4xl font-semibold text-smg">
              {cheapest ? formatMoney(cheapest.rate) : "0.03 USDT"}/1K
            </p>
            <p className="text-sm text-white/60">From</p>
          </div>
          <div>
            <p className="font-display text-4xl font-semibold">{(12000 + orderCount).toLocaleString()}+</p>
            <p className="text-sm text-white/60">Orders processed</p>
          </div>
          <div>
            <p className="font-display text-4xl font-semibold">{(1800 + userCount).toLocaleString()}+</p>
            <p className="text-sm text-white/60">Active users</p>
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { kind: "fast" as const, title: "Fast start", body: "Most view and like services begin within minutes." },
            { kind: "private" as const, title: "Private by default", body: "Hashed passwords, SSL and httpOnly sessions." },
            { kind: "checkout" as const, title: "Pay your way", body: "NGN, GHS, KES or USDT on SMG. Fulfillment stays separate." },
          ].map((item) => (
            <Card key={item.title} className="lift">
              <FeatureArt kind={item.kind} />
              <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/60">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-panel py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-center text-xs tracking-[0.28em] text-smg">HOW IT WORKS</p>
          <h2 className="mt-3 text-center font-display text-4xl">Four steps. Then we deliver.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.n} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="smg-gradient mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full font-bold text-black">
                  {step.n}
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-white/55">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <h2 className="text-center font-display text-4xl">Popular services</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { kind: "instagram" as const, title: "Instagram followers", href: "/services?cat=instagram" },
            { kind: "tiktok" as const, title: "TikTok likes", href: "/services?cat=tiktok" },
            { kind: "x" as const, title: "X / Twitter followers", href: "/services?cat=twitter" },
          ].map((item) => (
            <Card key={item.title} className="lift flex flex-col items-start">
              <PlatformMark kind={item.kind} />
              <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
              <Button href={item.href} variant="outline" className="mt-5">
                View rates
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <h2 className="text-center font-display text-4xl">What customers say</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.name}>
              <p className="text-white/75">&ldquo;{review.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full smg-gradient font-bold text-black">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-xs text-white/50">{review.place}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-center text-xs tracking-[0.22em] text-smg">FAQ</p>
        <h2 className="mt-3 text-center font-display text-4xl">Questions, answered</h2>
        <div className="mt-8">
          <FaqList faqs={faqs} />
        </div>
      </section>

      <section className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] smg-gradient p-[1px]">
          <div className="rounded-[2rem] bg-ink px-8 py-14 text-center">
            <h2 className="font-display text-4xl md:text-5xl">Ready when your content is.</h2>
            <p className="mt-3 text-white/60">Create an account, fund the wallet, place the order.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Button href="/register">Create account</Button>
              <Button href="/services" variant="outline">
                See prices
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
