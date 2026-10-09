import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui";

export const metadata = { title: "API Docs" };

export default function ApiDocsPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="font-display text-4xl">Reseller API</h1>
        <p className="mt-3 text-white/60">
          Compatible with standard SMM panel v2. Generate a key in the
          dashboard, then POST to <code className="mx-1 text-smg">/api/v2</code>. SMG fulfills
          orders through SMMTurk.
        </p>
        <Card className="mt-8 overflow-x-auto">
          <pre className="text-sm text-orange-100">{`POST /api/v2
Content-Type: application/json

{ "key": "smg_...", "action": "balance" }
{ "key": "smg_...", "action": "services" }
{ "key": "smg_...", "action": "add", "service": "ID", "link": "https://...", "quantity": 1000 }
{ "key": "smg_...", "action": "status", "order": "ORDER_ID" }
{ "key": "smg_...", "action": "status", "orders": "ID1,ID2" }
{ "key": "smg_...", "action": "refill", "order": "ORDER_ID" }
{ "key": "smg_...", "action": "refill_status", "refill": "REFILL_ID" }
{ "key": "smg_...", "action": "cancel", "orders": "ID1,ID2" }`}</pre>
        </Card>
      </div>
    </SiteShell>
  );
}
