import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function loadEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']+|["']+$/g, "");
  }
}

loadEnv();
if (process.env.DIRECT_URL) process.env.DATABASE_URL = process.env.DIRECT_URL;

const result = spawnSync("npx", ["prisma", "db", "push"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});
process.exit(result.status ?? 1);
