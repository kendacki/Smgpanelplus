import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { Card } from "@/components/ui";
import { SITE_URL } from "@/lib/site";

export const metadata = { title: "Reseller API" };

const endpoint = `${SITE_URL}/api/v2`;

const sections = [
  { href: "#start", label: "Start" },
  { href: "#balance", label: "Balance" },
  { href: "#services", label: "Services" },
  { href: "#add", label: "Add order" },
  { href: "#status", label: "Status" },
  { href: "#refill", label: "Refill" },
  { href: "#refill-status", label: "Refill status" },
  { href: "#cancel", label: "Cancel" },
  { href: "#php", label: "PHP client" },
  { href: "#errors", label: "Errors" },
];

function Example({ title, code }: { title: string; code: string }) {
  return (
    <div className="mt-4">
      <p className="text-xs uppercase tracking-[0.16em] text-white/40">{title}</p>
      <pre className="mt-2 overflow-x-auto rounded-2xl bg-black/50 p-4 text-xs leading-relaxed text-orange-100">
        {code}
      </pre>
    </div>
  );
}

function Params({ rows }: { rows: Array<[string, string, string]> }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/45">
          <tr>
            <th className="px-4 py-3">Parameter</th>
            <th className="px-4 py-3">Required</th>
            <th className="px-4 py-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, required, description]) => (
            <tr key={name} className="border-t border-white/8">
              <td className="px-4 py-3 font-mono text-xs text-smg">{name}</td>
              <td className="px-4 py-3 text-white/70">{required}</td>
              <td className="px-4 py-3 text-white/60">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:gap-10 sm:py-16 md:px-6 lg:grid-cols-[180px_1fr]">
        <nav className="hidden lg:block">
          <div className="sticky top-24 space-y-2 text-sm text-white/55">
            {sections.map((item) => (
              <a key={item.href} href={item.href} className="block hover:text-white">
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="min-w-0">
          <p className="text-smg">Resellers</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">Reseller API</h1>
          <p className="mt-3 max-w-2xl text-white/60">
            Standard SMM panel v2. Your script sends orders to SMG. We charge your USDT wallet and
            fulfill the order. Rates in <code className="text-smg">services</code> are the prices
            you pay, per 1,000 unless the service type is Package.
          </p>

          <section id="start" className="mt-10 scroll-mt-24">
            <h2 className="font-display text-2xl">Start</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-white/70">
              <li>Create an account and fund the wallet.</li>
              <li>
                Open <Link href="/dashboard/api" className="text-smg">Dashboard → API</Link> and copy
                your key.
              </li>
              <li>Call <span className="text-white">services</span> and store the service IDs and rates.</li>
              <li>Call <span className="text-white">add</span> to place an order. Save the returned order ID.</li>
              <li>Call <span className="text-white">status</span> until the order is completed.</li>
            </ol>
            <Card className="mt-6">
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">Endpoint</p>
              <p className="mt-2 break-all font-mono text-sm text-orange-100">{endpoint}</p>
              <p className="mt-4 text-sm text-white/60">
                POST form fields or JSON. GET with the same fields as query parameters also works.
                Send <span className="text-white">key</span> and <span className="text-white">action</span> on
                every request.
              </p>
              <Example
                title="JSON"
                code={`curl -X POST ${endpoint} \\
  -H "Content-Type: application/json" \\
  -d '{"key":"YOUR_API_KEY","action":"balance"}'`}
              />
              <Example
                title="Form"
                code={`curl -X POST ${endpoint} \\
  -d "key=YOUR_API_KEY&action=balance"`}
              />
            </Card>
          </section>

          <section id="balance" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl">Balance</h2>
            <p className="mt-2 text-sm text-white/60">Your remaining USDT wallet balance.</p>
            <Params rows={[["action", "Yes", "balance"]]} />
            <Example title="Response" code={`{\n  "balance": "24.50000",\n  "currency": "USDT"\n}`} />
          </section>

          <section id="services" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl">Services</h2>
            <p className="mt-2 text-sm text-white/60">
              The catalog your panel should resell. <span className="text-white">service</span> is the ID
              you send to <span className="text-white">add</span>. <span className="text-white">rate</span> is
              USDT per 1,000.
            </p>
            <Params rows={[["action", "Yes", "services"]]} />
            <Example
              title="Response"
              code={`[\n  {\n    "service": "cm123abc",\n    "name": "Instagram Followers",\n    "type": "Default",\n    "category": "Instagram Followers",\n    "rate": "1.2400",\n    "min": "100",\n    "max": "10000",\n    "refill": true,\n    "cancel": true,\n    "dripfeed": false\n  }\n]`}
            />
          </section>

          <section id="add" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl">Add order</h2>
            <p className="mt-2 text-sm text-white/60">
              Place one order. The charge is taken from your wallet. A successful call returns the SMG
              order ID.
            </p>
            <Params
              rows={[
                ["action", "Yes", "add"],
                ["service", "Yes", "Service ID from the services list"],
                ["link", "Usually", "Target URL. Not used for subscriptions."],
                ["quantity", "Usually", "Amount to deliver. Must be inside min and max."],
                ["runs", "Drip-feed", "How many times to repeat the quantity"],
                ["interval", "Drip-feed", "Minutes between runs"],
                ["comments", "Custom comments", "One comment per line"],
                ["usernames", "Mentions list", "One username per line"],
                ["username", "Mentions / subscription", "A single username"],
                ["keywords", "SEO", "Comma-separated keywords"],
                ["hashtag", "Hashtag mentions", "Hashtag without extra spaces"],
                ["groups", "Invites", "One group per line"],
                ["answer_number", "Poll", "The poll answer number"],
                ["min / max", "Subscription", "Quantity range per post"],
                ["posts / old_posts", "Subscription", "How many posts to cover"],
                ["delay", "Subscription", "Minutes between posts"],
                ["expiry", "Subscription", "End date, for example 11/11/2026"],
              ]}
            />
            <Example
              title="Default"
              code={`{\n  "key": "YOUR_API_KEY",\n  "action": "add",\n  "service": "SERVICE_ID",\n  "link": "https://instagram.com/p/example",\n  "quantity": 1000\n}`}
            />
            <Example
              title="Drip-feed"
              code={`{\n  "key": "YOUR_API_KEY",\n  "action": "add",\n  "service": "SERVICE_ID",\n  "link": "https://example.com/post",\n  "quantity": 100,\n  "runs": 10,\n  "interval": 60\n}`}
            />
            <Example
              title="Custom comments"
              code={`{\n  "key": "YOUR_API_KEY",\n  "action": "add",\n  "service": "SERVICE_ID",\n  "link": "https://example.com/post",\n  "comments": "good pic\\ngreat photo\\n:)"\n}`}
            />
            <Example
              title="Subscription"
              code={`{\n  "key": "YOUR_API_KEY",\n  "action": "add",\n  "service": "SERVICE_ID",\n  "username": "accountname",\n  "min": 100,\n  "max": 110,\n  "old_posts": 5,\n  "delay": 30,\n  "expiry": "11/11/2026"\n}`}
            />
            <Example title="Response" code={`{\n  "order": "cmorder123"\n}`} />
          </section>

          <section id="status" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl">Order status</h2>
            <p className="mt-2 text-sm text-white/60">
              One order uses <span className="text-white">order</span>. Several orders use{" "}
              <span className="text-white">orders</span> as a comma-separated list, up to 100.
            </p>
            <Params
              rows={[
                ["action", "Yes", "status"],
                ["order", "One order", "Order ID returned by add"],
                ["orders", "Many orders", "ID1,ID2,ID3"],
              ]}
            />
            <Example
              title="One order"
              code={`{\n  "charge": "1.24000",\n  "start_count": "1200",\n  "status": "In Progress",\n  "remains": "400",\n  "currency": "USDT"\n}`}
            />
            <Example
              title="Many orders"
              code={`{\n  "cmorder123": {\n    "charge": "1.24000",\n    "start_count": "1200",\n    "status": "Completed",\n    "remains": "0",\n    "currency": "USDT"\n  },\n  "cmorder456": { "error": "Incorrect order ID" }\n}`}
            />
          </section>

          <section id="refill" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl">Refill</h2>
            <p className="mt-2 text-sm text-white/60">
              Only services marked <span className="text-white">refill: true</span> can be refilled.
            </p>
            <Params
              rows={[
                ["action", "Yes", "refill"],
                ["order", "One order", "Order ID"],
                ["orders", "Many orders", "ID1,ID2"],
              ]}
            />
            <Example title="One order" code={`{\n  "refill": "987654"\n}`} />
            <Example
              title="Many orders"
              code={`[\n  { "order": "cmorder123", "refill": "987654" },\n  { "order": "cmorder456", "refill": { "error": "This service does not support refill" } }\n]`}
            />
          </section>

          <section id="refill-status" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl">Refill status</h2>
            <Params
              rows={[
                ["action", "Yes", "refill_status"],
                ["refill", "One refill", "Refill ID returned by refill"],
                ["refills", "Many refills", "ID1,ID2"],
              ]}
            />
            <Example title="Response" code={`{\n  "status": "Completed"\n}`} />
          </section>

          <section id="cancel" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl">Cancel</h2>
            <p className="mt-2 text-sm text-white/60">
              Cancel one or more orders that the service allows. Send the IDs in{" "}
              <span className="text-white">orders</span>.
            </p>
            <Params
              rows={[
                ["action", "Yes", "cancel"],
                ["orders", "Yes", "ID1,ID2"],
              ]}
            />
            <Example
              title="Response"
              code={`[\n  { "order": "cmorder123", "cancel": "554433" },\n  { "order": "cmorder456", "cancel": { "error": "Order is not with the provider yet" } }\n]`}
            />
          </section>

          <section id="php" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl">PHP client</h2>
            <p className="mt-2 text-sm text-white/60">
              Drop this into a child panel. It speaks the same actions as the examples above.
            </p>
            <Example
              title="smg-api.php"
              code={`<?php
class SmgApi {
    public $api_url = '${endpoint}';
    public $api_key = 'YOUR_API_KEY';

    public function balance() {
        return json_decode($this->connect(['key' => $this->api_key, 'action' => 'balance']));
    }

    public function services() {
        return json_decode($this->connect(['key' => $this->api_key, 'action' => 'services']));
    }

    public function order($data) {
        $post = array_merge(['key' => $this->api_key, 'action' => 'add'], $data);
        return json_decode($this->connect($post));
    }

    public function status($order_id) {
        return json_decode($this->connect([
            'key' => $this->api_key,
            'action' => 'status',
            'order' => $order_id,
        ]));
    }

    public function multiStatus($order_ids) {
        return json_decode($this->connect([
            'key' => $this->api_key,
            'action' => 'status',
            'orders' => implode(',', (array) $order_ids),
        ]));
    }

    public function refill($order_id) {
        return json_decode($this->connect([
            'key' => $this->api_key,
            'action' => 'refill',
            'order' => $order_id,
        ]));
    }

    public function cancel($order_ids) {
        return json_decode($this->connect([
            'key' => $this->api_key,
            'action' => 'cancel',
            'orders' => implode(',', (array) $order_ids),
        ]), true);
    }

    private function connect($post) {
        $fields = [];
        foreach ($post as $name => $value) {
            $fields[] = $name . '=' . urlencode($value);
        }
        $ch = curl_init($this->api_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, implode('&', $fields));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }
}

$api = new SmgApi();
$services = $api->services();
$balance = $api->balance();
$order = $api->order([
    'service' => 'SERVICE_ID',
    'link' => 'https://example.com/post',
    'quantity' => 1000,
]);
$status = $api->status($order->order);
`}
            />
          </section>

          <section id="errors" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl">Errors</h2>
            <p className="mt-2 text-sm text-white/60">
              A failed call returns JSON with an <span className="text-white">error</span> message. Do
              not retry <span className="text-white">add</span> until you know the first call failed,
              or you may place the order twice.
            </p>
            <Example
              title="Examples"
              code={`{ "error": "API key is required" }
{ "error": "Invalid API key" }
{ "error": "Incorrect request" }
{ "error": "Incorrect quantity" }
{ "error": "Insufficient balance. Add funds to continue." }
{ "error": "Incorrect order ID" }`}
            />
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
