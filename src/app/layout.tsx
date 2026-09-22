import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { readSession } from "@/lib/auth";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Best SMM Panel in Nigeria & Africa`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "SMG Panel is a trusted, affordable SMM panel for Nigeria, Ghana and Kenya. Buy Instagram followers, TikTok likes, YouTube views and more with local payments.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Best SMM Panel in Nigeria & Africa`,
    description:
      "Trusted SMM panel for Nigeria, Ghana and Kenya. Followers, likes, views and reseller API.",
  },
  icons: { icon: "/logo.jpg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();

  return (
    <html lang="en" className={`${jakarta.variable} ${sora.variable}`}>
      <body className="font-sans antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
