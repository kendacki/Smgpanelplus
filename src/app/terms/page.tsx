import { SiteShell } from "@/components/site-shell";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="font-display text-4xl">Terms of Service</h1>
        <div className="mt-6 space-y-4 text-sm text-white/70">
          <p>
            SMG Panel provides social media marketing services. You must own or have permission to
            promote the accounts you submit. We do not guarantee platform algorithm outcomes.
          </p>
          <p>
            Wallet credits are non-transferable. Completed orders are not refunded except where a
            service fails to deliver and cannot be refilled. Partial orders may be refunded on the
            undelivered remainder.
          </p>
          <p>
            You will not use SMG Panel for scams, impersonation, hate, or illegal activity. We may
            suspend accounts that abuse the API or payment systems.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
