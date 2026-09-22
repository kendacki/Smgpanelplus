import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-smg">404</p>
        <h1 className="mt-2 font-display text-4xl">Page not found</h1>
        <p className="mt-2 text-white/55">The page you requested does not exist or was moved.</p>
        <Link href="/" className="mt-6">
          <Button>Back home</Button>
        </Link>
      </div>
    </SiteShell>
  );
}
