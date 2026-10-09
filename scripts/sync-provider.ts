import { existsSync, readFileSync } from "node:fs";
import { isProviderConfigured } from "../src/lib/provider";
import { syncProviderCatalog } from "../src/lib/sync-services";

function loadEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']+|["']+$/g, "");
  }
}

async function main() {
  loadEnv();
  if (process.env.DIRECT_URL) process.env.DATABASE_URL = process.env.DIRECT_URL;
  if (!isProviderConfigured()) {
    throw new Error("Set AMAZINGSMM_API_KEY before syncing the catalog");
  }
  console.log("Fetching provider services from", process.env.AMAZINGSMM_API_URL || process.env.SMM_API_URL);
  const result = await syncProviderCatalog();
  console.log(`Imported ${result.imported} services across ${result.categories} categories.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
