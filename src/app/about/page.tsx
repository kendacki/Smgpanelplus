import { SiteShell } from "@/components/site-shell";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-smg">Company</p>
        <h1 className="mt-2 font-display text-4xl">About SMG Panel</h1>
        <p className="mt-6 text-white/70">
          SMG Panel is an African SMM panel built for creators, agencies and resellers who need
          reliable likes, followers, views and comments without paying Western panel prices.
        </p>
        <p className="mt-4 text-white/70">
          We focus on Nigeria, Ghana and Kenya with local payment rails, a clean dashboard, and a
          reseller API. The brand is simple: orange heat on black, speed, and support that actually
          answers.
        </p>
      </div>
    </SiteShell>
  );
}
