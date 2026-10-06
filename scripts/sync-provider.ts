import { isProviderConfigured } from "../src/lib/provider";
import { syncProviderCatalog } from "../src/lib/sync-services";

async function main() {
  if (!isProviderConfigured()) {
    throw new Error("Set AMAZINGSMM_API_KEY before syncing the catalog");
  }
  const result = await syncProviderCatalog();
  console.log(`Imported ${result.imported} services across ${result.categories} categories.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
