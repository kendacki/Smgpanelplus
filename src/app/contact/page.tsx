"use client";

import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Alert, Button, Card, Input, Textarea } from "@/components/ui";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteShell>
      <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
        <h1 className="font-display text-4xl">Contact us</h1>
        <p className="mt-2 text-white/60">We typically reply within a few hours.</p>
        <Card className="mt-8">
          {sent ? (
            <Alert tone="success">Message received. We will get back to you shortly.</Alert>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <Input required placeholder="Name" />
              <Input required type="email" placeholder="Email" />
              <Textarea required rows={5} placeholder="How can we help?" />
              <Button type="submit" className="w-full">
                Send
              </Button>
            </form>
          )}
        </Card>
      </div>
    </SiteShell>
  );
}
