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

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required. Run npm run supabase:setup or set a Supabase Postgres URL.");
  process.exit(1);
}

run("npx prisma generate");
run("npx prisma db push");
if (process.env.SEED_ON_BUILD === "1") {
  run("npx tsx prisma/seed.ts");
}
run("npx next build");
