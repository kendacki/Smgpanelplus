import Link from "next/link";
import {
  Check,
  Cpu,
  Headphones,
  Lock,
  PanelsTopLeft,
  Rocket,
  Shield,
  Smartphone,
  Star,
  Timer,
  Wallet,
  Zap,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button, Card } from "@/components/ui";
import { SignInForm } from "@/components/sign-in-form";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";

const steps = [
  { n: "1", title: "Register", body: "Sign up with your email and create an account to get started." },
  { n: "2", title: "Add Funds", body: "Top up your wallet with Paystack, M-Pesa, MoMo, bank or USDT." },
  { n: "3", title: "Select Service", body: "Browse Instagram, TikTok, YouTube, Facebook and more." },
  { n: "4", title: "Paste Account Link", body: "Submit the URL required for the service. Check the example first." },
  { n: "5", title: "Submit", body: "Complete your request and we process it for fast results." },
];

const reviews = [
  {
    name: "Kunle",
    place: "Lagos",
    quote:
      "As a business owner I wanted local buyers. SMG's Nigerian comment service gave my page more local engagement, and now I get more inquiries.",
  },
  {
    name: "Efua",
    place: "Cape Coast",
    quote:
      "My Telegram posts were falling flat. SMG Panel sparked real conversations and the comments started rolling in.",
  },
  {
    name: "Amani",
    place: "Nairobi",
    quote:
      "Going live on TikTok used to feel like talking to myself. Live comments made my streams feel alive. This is the sauce.",
  },
  {
    name: "Akosua Styles",
    place: "Accra",
    quote: "I run a thrift page in Accra. SMG Panel helped me gain real followers in under two weeks.",
  },
];

export default async function HomePage() {
  const [orderCount, userCount, cheapest, faqs, posts] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.service.findFirst({ orderBy: { rate: "asc" } }),
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" }, take: 4 }),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="mesh absolute inset-0 opacity-40" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-smg/30 bg-smg/10 px-3 py-1 text-xs font-semibold text-orange-200">
              Top SMM Panel in Nigeria & Africa
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
              Want To Boost Your <span className="gradient-text">SOCIAL MEDIA</span> all round Africa with Ease?
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/65">
              You&apos;ve found a trusted, legit and affordable SMM panel built for influencers, brands and
              businesses. Get authentic followers, likes and engagement — fast.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button className="px-8 py-3 text-base">Get Started</Button>
              </Link>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex text-smg">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-white/70">Excellent 4.8 / 5</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/75">
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-smg" /> Child Panel for resellers
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-smg" /> Cheapest panel in Africa
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-smg" /> Fully integrated API
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="floaty orange-ring absolute -left-6 top-10 hidden h-64 w-40 rounded-[2.2rem] border border-white/10 bg-gradient-to-b from-[#1a1a1a] to-black p-3 lg:block">
              <div className="h-full rounded-[1.6rem] bg-[#0b0b0b] p-3">
                <div className="smg-gradient mb-3 h-2 w-16 rounded-full" />
                <div className="space-y-2">
                  <div className="h-16 rounded-2xl bg-white/5" />
                  <div className="h-8 rounded-xl bg-white/5" />
                  <div className="h-8 rounded-xl bg-white/5" />
                </div>
              </div>
            </div>
            <Card className="relative z-10 ml-auto max-w-md orange-ring">
              <h2 className="font-display text-2xl font-semibold">SIGN IN</h2>
              <p className="mb-6 mt-1 text-sm text-white/55">
                Access your account and take control of your social media growth
              </p>
              <SignInForm compact />
              <p className="mt-4 text-center text-sm text-white/50">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-smg">
                  Sign up
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#0a0a0a]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3 md:px-6">
          {[
            {
              title: "How to use SMG Panel in Kenya",
              body: "Switch currency to KES, add funds with M-Pesa, then place orders from the dashboard.",
              href: "/register",
            },
            {
              title: "How to use SMG Panel in Ghana",
              body: "Switch currency to GHS and top up with MoMo. Prices update instantly.",
              href: "/register",
            },
            {
              title: "How to use SMG Panel in Nigeria",
              body: "Pay with Paystack, Flutterwave or bank transfer in NGN. Start from ₦20 / 1K views.",
              href: "/register",
            },
          ].map((item) => (
            <Card key={item.title}>
              <h3 className="font-display text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-white/60">{item.body}</p>
              <Link href={item.href} className="mt-4 inline-block text-sm text-smg">
                Sign Up →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <p className="text-center text-xs tracking-[0.3em] text-smg">EXPLORE OUR SERVICES</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center font-display text-3xl font-semibold md:text-5xl">
          Fast, affordable and reliable growth for the top SMM panel in Africa
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Single Order",
              body: "Need a quick boost? Place targeted likes, followers or views in a few clicks.",
              href: "/dashboard",
            },
            {
              icon: Rocket,
              title: "Mass Order",
              body: "Managing multiple campaigns? Paste bulk lines and run them like a pro.",
              href: "/dashboard/mass-order",
            },
            {
              icon: PanelsTopLeft,
              title: "Child Panel",
              body: "Dreaming of your own SMM panel? Resell SMG services with your own brand.",
              href: "/child-panel",
            },
          ].map((item) => (
            <Card key={item.title} className="hover:orange-ring transition">
              <item.icon className="h-10 w-10 text-smg" />
              <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm text-white/60">{item.body}</p>
              <Link href={item.href} className="mt-5 inline-flex text-sm font-medium text-smg">
                {item.title} →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#1a0d00] to-black">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:px-6">
          <div>
            <p className="text-smg">Get authentic African engagement</p>
            <h2 className="mt-2 font-display text-4xl font-semibold">
              Let&apos;s help you grow your visibility the smart way
            </h2>
            <p className="mt-4 text-white/65">
              Even when your content is fire, growth can feel impossible without the right push. Your reels
              are stuck, you post daily with few likes, your videos are lit but the page is not moving.
            </p>
            <ul className="mt-6 space-y-3 text-white/80">
              {[
                "Nigerian, Ghanaian and Kenyan audience packages",
                "Affordable boosts with MoMo, M-Pesa and cards",
                "TikTok, Instagram, Facebook, YouTube and Telegram",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <Check className="mt-0.5 h-5 w-5 text-smg" /> {line}
                </li>
              ))}
            </ul>
            <Link href="/register" className="mt-8 inline-block">
              <Button>Get Started Now</Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Ghanaian Audiences", "Real engagement from people who understand the content"],
              ["Affordable Packages", "MoMo-friendly pricing that respects African budgets"],
              ["Multi-Platform", "IG, TikTok, Facebook, YouTube, Telegram, Spotify"],
              ["Trusted Service", "Used by creators, stores and resellers across Africa"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <h2 className="text-center font-display text-4xl font-semibold">Why you should choose us</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Timer, title: "On-Time Delivery", body: "Right place, right time. We start orders quickly and keep you updated in the dashboard." },
            { icon: Lock, title: "Secure & Private", body: "SSL, hashed passwords and httpOnly sessions. We never ask for your social password." },
            { icon: Headphones, title: "24/7 Helpline", body: "Tickets and support for order or service questions, day or night." },
          ].map((item) => (
            <Card key={item.title}>
              <item.icon className="h-8 w-8 text-smg" />
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/60">{item.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-12 grid gap-4 rounded-3xl border border-smg/30 bg-smg/10 p-8 text-center md:grid-cols-3">
          <div>
            <p className="font-display text-4xl font-semibold text-smg">
              {cheapest ? formatMoney(cheapest.rate, "NGN") : "₦20"}/1K
            </p>
            <p className="text-sm text-white/60">Starting price</p>
          </div>
          <div>
            <p className="font-display text-4xl font-semibold">{(7753367 + orderCount).toLocaleString()}</p>
            <p className="text-sm text-white/60">Orders counting</p>
          </div>
          <div>
            <p className="font-display text-4xl font-semibold">{(286547 + userCount).toLocaleString()}</p>
            <p className="text-sm text-white/60">Active users</p>
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-center text-xs tracking-[0.3em] text-smg">HOW TO GET STARTED</p>
          <h2 className="mt-3 text-center font-display text-4xl">Five easy steps and you are good to go</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-5">
            {steps.map((step) => (
              <div key={step.n} className="rounded-3xl border border-white/10 p-5">
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
        <p className="text-center text-xs tracking-[0.3em] text-smg">WHAT&apos;S TRENDING</p>
        <h2 className="mt-3 text-center font-display text-4xl">Top services for instant growth</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["IG Followers", "Boost credibility with high-quality Instagram followers — fast and refill-ready.", "/services?cat=instagram"],
            ["TikTok Likes", "Go viral faster. More likes so your content can shine on For You pages.", "/services?cat=tiktok"],
            ["Twitter Followers", "Build influence on X with quality followers and make your voice heard.", "/services?cat=twitter"],
          ].map(([title, body, href]) => (
            <Card key={title} className="flex flex-col">
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-2 flex-1 text-sm text-white/60">{body}</p>
              <Link href={href} className="mt-6">
                <Button variant="outline">Explore Service</Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-[#0a0a0a] py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-display text-4xl">Our blog</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:orange-ring">
                  <p className="text-xs text-smg">{post.createdAt.toDateString()}</p>
                  <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
                  <p className="mt-2 text-sm text-white/55">{post.excerpt}</p>
                  <p className="mt-4 text-sm text-smg">Read more →</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <h2 className="text-center font-display text-4xl">Reviews from happy customers</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <Card key={review.name}>
              <p className="text-white/75">&ldquo;{review.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
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

      <section className="mx-auto max-w-4xl px-4 pb-10 md:px-6">
        <h2 className="text-center font-display text-4xl">FAQ</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.id} className="glass rounded-2xl px-5 py-4">
              <summary className="cursor-pointer font-medium">{faq.question}</summary>
              <p className="mt-2 text-sm text-white/60">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] smg-gradient p-[1px]">
          <div className="rounded-[2rem] bg-black px-8 py-14 text-center">
            <h2 className="font-display text-4xl md:text-5xl">Post smarter. Engage bigger. Grow faster.</h2>
            <p className="mt-3 text-white/60">Sign up now and watch your social media skyrocket.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
              <Link href="/services">
                <Button variant="outline">See Services</Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/55">
              <span className="inline-flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-smg" /> M-Pesa & MoMo
              </span>
              <span className="inline-flex items-center gap-2">
                <Wallet className="h-4 w-4 text-smg" /> Cards & bank transfer
              </span>
              <span className="inline-flex items-center gap-2">
                <Cpu className="h-4 w-4 text-smg" /> Reseller API
              </span>
              <span className="inline-flex items-center gap-2">
                <Shield className="h-4 w-4 text-smg" /> SSL secure
              </span>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
