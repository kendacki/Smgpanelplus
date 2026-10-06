import { spawnSync } from "node:child_process";

process.env.AUTH_SECRET ||= "smg-panel-dev-secret-change-in-production-min-32-chars";
process.env.NEXT_PUBLIC_APP_URL ||= "https://smgpanelplus.com";
process.env.NEXT_PUBLIC_APP_NAME ||= "SMG Panel";

function run(command) {
  const result = spawnSync(command, {
    stdio: "inherit",
    env: process.env,
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function postgresUrl(raw) {
  const value = String(raw || "")
    .trim()
    .replace(/^["']|["']$/g, "");
  if (value.startsWith("postgresql://") || value.startsWith("postgres://")) return value;
  return "";
}

const originalDatabaseUrl = process.env.DATABASE_URL;
const liveDatabaseUrl =
  postgresUrl(process.env.DATABASE_URL) ||
  postgresUrl(process.env.POSTGRES_PRISMA_URL) ||
  postgresUrl(process.env.POSTGRES_URL);

process.env.DATABASE_URL =
  liveDatabaseUrl || "postgresql://postgres:postgres@127.0.0.1:5432/postgres?schema=public";

if (!liveDatabaseUrl) {
  console.warn(
    "DATABASE_URL is missing or not Postgres (often leftover file:./dev.db). Skipping db push. Set a Supabase postgresql:// URL in Vercel env vars.",
  );
}

run("npx prisma generate");

const onVercel = process.env.VERCEL === "1";
if (liveDatabaseUrl && (!onVercel || process.env.PRISMA_PUSH_ON_BUILD === "1")) {
  run("npx prisma db push");
  if (process.env.SEED_ON_BUILD === "1") {
    run("npx tsx prisma/seed.ts");
  }
} else if (onVercel) {
  console.log("Skipping prisma db push on Vercel.");
}

if (liveDatabaseUrl) process.env.DATABASE_URL = liveDatabaseUrl;
else if (originalDatabaseUrl) process.env.DATABASE_URL = originalDatabaseUrl;

run("npx next build");
