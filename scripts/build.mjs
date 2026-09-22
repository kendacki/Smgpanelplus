import { spawnSync } from "node:child_process";

process.env.DATABASE_URL ||= "file:./dev.db";
process.env.AUTH_SECRET ||= "smg-panel-dev-secret-change-in-production-min-32-chars";

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

run("npx prisma generate");
run("npx prisma db push");
run("npx tsx prisma/seed.ts");
run("npx next build");
