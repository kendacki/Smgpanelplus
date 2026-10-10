import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { FaqList } from "@/components/faq-list";
import { Button, Card } from "@/components/ui";
import { PlatformMark, Flag3D, ProductArt, ReviewPortrait } from "@/components/illustrations";
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
    person: "kunle" as const,
    quote: "Local comments made my shop page feel alive. Inquiries went up the same week.",
  },
  {
    name: "Amani",
    place: "Nairobi",
    person: "amani" as const,
    quote: "TikTok lives used to be quiet. SMG comments made the room feel full.",
  },
  {
    name: "Akosua",
    place: "Accra",
    person: "akosua" as const,
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
      <section className="relative overflow-hidden bg-black">
        <div className="mx-auto grid max-w-7xl items-end gap-2 sm:gap-6 lg:grid-cols-2">
          <div className="px-4 pb-6 pt-8 sm:pb-12 sm:pt-16 md:px-6 lg:pb-20 lg:pt-24">
            <h1 className="font-display text-3xl font-semibold leading-[1.08] sm:text-4xl md:text-6xl">
              Grow your audience across the <span className="gradient-text">World</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/65 sm:mt-5 sm:text-lg">
              Followers, likes and views for Instagram, TikTok, YouTube and more. Pay in Naira,
              cedis, shillings or USDT, then track every order in one dashboard.
            </p>
            <div className="relative z-10 mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href="/register" className="w-full px-6 py-3 text-sm sm:w-auto sm:px-8 sm:text-base">
                Start growing
              </Button>
              <Button href="/services" variant="outline" className="w-full sm:w-auto">
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
              className="h-auto w-full max-w-[180px] object-contain object-bottom sm:max-w-[300px] md:max-w-[380px] lg:max-w-[410px] [mask-image:linear-gradient(to_bottom,black_76%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_76%,transparent_100%)]"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-panel/80">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:gap-6 sm:py-10 md:grid-cols-3 md:px-6">
          {[
            { title: "Nigeria" as const, body: "Creators and shops across Nigeria. Pay in Naira or USDT." },
            { title: "Ghana" as const, body: "Ghanaian pages and brands. Pay in cedis or USDT." },
            { title: "Kenya" as const, body: "Kenyan creators and resellers. Pay in shillings or USDT." },
          ].map((item) => (
            <div key={item.title} className="perspective-scene flex items-center gap-3 rounded-2xl border border-white/8 bg-black/30 p-3 sm:gap-4 sm:rounded-3xl sm:p-5">
              <Flag3D country={item.title} />
              <div>
                <h3 className="font-display text-lg sm:text-xl">{item.title}</h3>
                <p className="mt-1 text-xs text-white/55 sm:text-sm">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-20 md:px-6">
        <h2 className="mx-auto max-w-2xl text-center font-display text-2xl font-semibold sm:text-3xl md:text-5xl">
          One panel for orders, bulk work and resale
        </h2>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
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
              <Card className="lift h-full text-center">
                <ProductArt kind={item.kind} />
                <h3 className="mt-2 font-display text-xl sm:text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.body}</p>
                <p className="mt-5 text-sm font-medium text-smg">Open →</p>
              </Card>
            </Link>
          ))}
        </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#1a0e04] via-black to-[#0b0b10]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:gap-12 sm:py-20 md:px-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h2 className="max-w-xl font-display text-3xl font-semibold sm:text-4xl md:text-5xl">
              Visibility without the guesswork
            </h2>
            <p className="mt-4 max-w-xl text-white/65">
              Put distribution behind content that already works. SMG is for shops, musicians and
              pages that need reach, not noise.
            </p>
            <ul className="mt-8 grid gap-3">
              {[
                "Packages aimed at Nigerian, Ghanaian and Kenyan audiences",
                "Instagram, TikTok, YouTube, Facebook, Telegram and Spotify",
                "We never ask for your social password",
              ].map((line) => (
                <li key={line} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white/85 sm:px-4 sm:py-3 sm:text-base">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-smg text-black shadow-[0_0_16px_rgba(255,106,0,0.45)]">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <img
              src="/illustrations/visibility.png"
              alt="Glossy orange looped ribbon"
              width={469}
              height={535}
              className="h-auto w-full max-w-[240px] bg-transparent sm:max-w-[320px] lg:max-w-[400px]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-20 md:px-6">
        <div className="grid gap-4 rounded-3xl border border-smg/25 bg-smg/10 p-5 text-center sm:p-8 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-semibold text-smg sm:text-4xl">
              {cheapest ? formatMoney(cheapest.rate) : "0.03 USDT"}/1K
            </p>
            <p className="text-sm text-white/60">From</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold sm:text-4xl">{(12000 + orderCount).toLocaleString()}+</p>
            <p className="text-sm text-white/60">Orders processed</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold sm:text-4xl">{(1800 + userCount).toLocaleString()}+</p>
            <p className="text-sm text-white/60">Active users</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-3">
          {[
            { src: "/illustrations/fast-start.svg", title: "Fast start", body: "Most view and like services begin within minutes." },
            { src: "/illustrations/private-default.svg", title: "Private by default", body: "Hashed passwords, SSL and httpOnly sessions." },
            { src: "/illustrations/pay-your-way.svg", title: "Pay your way", body: "NGN, GHS, KES or USDT on SMG. Fulfillment stays separate." },
          ].map((item) => (
            <Card key={item.title} className="lift text-center">
              <img src={item.src} alt="" width={256} height={256} className="mx-auto mb-1 h-20 w-20 sm:h-28 sm:w-28" />
              <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/60">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-panel py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-center text-[11px] tracking-[0.22em] text-smg sm:text-xs sm:tracking-[0.28em]">HOW IT WORKS</p>
          <h2 className="mt-3 text-center font-display text-2xl sm:text-4xl">Four steps. Then we deliver.</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.n} className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:rounded-3xl sm:p-5">
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

      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-20 md:px-6">
        <h2 className="text-center font-display text-2xl sm:text-4xl">Popular services</h2>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
          {[
            { kind: "instagram" as const, title: "Instagram followers", href: "/services?cat=instagram" },
            { kind: "tiktok" as const, title: "TikTok likes", href: "/services?cat=tiktok" },
            { kind: "x" as const, title: "X / Twitter followers", href: "/services?cat=twitter" },
          ].map((item) => (
            <Card key={item.title} className="lift flex flex-col items-center text-center">
              <PlatformMark kind={item.kind} />
              <h3 className="mt-3 font-display text-xl sm:mt-4 sm:text-2xl">{item.title}</h3>
              <Button href={item.href} variant="outline" className="mt-5">
                View rates
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <h2 className="text-center font-display text-2xl sm:text-4xl">What customers say</h2>
        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.name}>
              <p className="text-white/75">&ldquo;{review.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <ReviewPortrait person={review.person} />
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-xs text-white/50">{review.place}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:py-16 md:px-6">
        <p className="text-center text-xs tracking-[0.22em] text-smg">FAQ</p>
        <h2 className="mt-3 text-center font-display text-2xl sm:text-4xl">Questions, answered</h2>
        <div className="mt-8">
          <FaqList faqs={faqs} />
        </div>
      </section>

      <section className="px-4 pb-16 sm:pb-20 md:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] smg-gradient p-[1px] sm:rounded-[2rem]">
          <div className="rounded-[1.5rem] bg-ink px-5 py-10 text-center sm:rounded-[2rem] sm:px-8 sm:py-14">
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl">Ready when your content is.</h2>
            <p className="mt-3 text-sm text-white/60 sm:text-base">Create an account, fund the wallet, place the order.</p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
              <Button href="/register" className="w-full sm:w-auto">Create account</Button>
              <Button href="/services" variant="outline" className="w-full sm:w-auto">
                See prices
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
