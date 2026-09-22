import { SiteShell } from "@/components/site-shell";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="font-display text-4xl">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-sm text-white/70">
          <p>
            We store your username, email, hashed password, wallet balance, orders and support
            tickets. We never ask for social media passwords.
          </p>
          <p>
            Session cookies are httpOnly. API keys can be rotated from the dashboard. We do not sell
            personal data.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
