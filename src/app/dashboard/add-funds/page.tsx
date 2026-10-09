import { Suspense } from "react";
import { AddFundsClient } from "./add-funds-client";

export default function AddFundsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-white/50">Loading wallet…</p>}>
      <AddFundsClient />
    </Suspense>
  );
}
