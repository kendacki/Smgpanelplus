import { SiteShell } from "@/components/site-shell";
import { GlobeArt } from "@/components/illustrations";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <p className="text-smg">Company</p>
          <h1 className="mt-2 font-display text-4xl">Built for African growth</h1>
          <p className="mt-6 text-white/70">
            SMG Panel helps creators, shops and resellers get seen on Instagram, TikTok, YouTube and
            more — at prices that make sense in NGN, GHS and KES.
          </p>
          <p className="mt-4 text-white/70">
            We fulfill the orders. You keep the brand, the content and the customer.
          </p>
        </div>
        <GlobeArt />
      </div>
    </SiteShell>
  );
}
