import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const envPath = ".env";
const examplePath = ".env.example";

function run(command, extra = {}) {
  const result = spawnSync(command, {
    stdio: extra.stdio ?? "inherit",
    encoding: "utf8",
    env: process.env,
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error(`${command} failed`);
  }
  return result;
}

function upsertEnv(path, values) {
  let text = existsSync(path) ? readFileSync(path, "utf8") : "";
  if (!text.endsWith("\n") && text.length) text += "\n";
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}="${value}"`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    if (pattern.test(text)) {
      text = text.replace(pattern, line);
    } else {
      text += `${line}\n`;
    }
  }
  writeFileSync(path, text);
}

function parseStatusEnv(output) {
  const values = {};
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    values[match[1]] = match[2].replace(/^"|"$/g, "");
  }
  return values;
}

if (!existsSync("supabase/config.toml")) {
  run("npx supabase init");
}

const configPath = "supabase/config.toml";
if (existsSync(configPath)) {
  let config = readFileSync(configPath, "utf8");
  config = config.replace(/site_url = ".*"/, 'site_url = "http://localhost:3000"');
  config = config.replace(/enable_confirmations = true/g, "enable_confirmations = false");
  if (/additional_redirect_urls = \[/.test(config)) {
    config = config.replace(
      /additional_redirect_urls = \[[^\]]*\]/,
      'additional_redirect_urls = ["http://localhost:3000/auth/callback", "https://smgpanelplus.com/auth/callback"]',
    );
  }
  writeFileSync(configPath, config);
}

console.log("Starting local Supabase (Docker)...");
run("npx supabase start");

const status = run("npx supabase status -o env", { stdio: "pipe" });
const parsed = parseStatusEnv(status.stdout || "");
const apiUrl = parsed.API_URL || parsed.SUPABASE_URL || "http://127.0.0.1:54321";
const anonKey = parsed.ANON_KEY || parsed.PUBLISHABLE_KEY || "";
const serviceKey = parsed.SERVICE_ROLE_KEY || parsed.SECRET_KEY || "";
const dbUrl =
  parsed.DB_URL ||
  parsed.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

if (!anonKey || !serviceKey) {
  throw new Error("Could not read Supabase keys from `supabase status`");
}

const envValues = {
  NEXT_PUBLIC_SUPABASE_URL: apiUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: anonKey,
  SUPABASE_SERVICE_ROLE_KEY: serviceKey,
  DATABASE_URL: dbUrl,
};

upsertEnv(envPath, envValues);
upsertEnv(examplePath, {
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "your-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "your-service-role-key",
  DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
});

const supabase = createClient(apiUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data: buckets } = await supabase.storage.listBuckets();
if (!buckets?.some((bucket) => bucket.name === "uploads")) {
  const { error } = await supabase.storage.createBucket("uploads", {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
  });
  if (error && !/already exists/i.test(error.message)) {
    console.warn("Could not create uploads bucket:", error.message);
  } else {
    console.log("Created public storage bucket: uploads");
  }
}

process.env.DATABASE_URL = dbUrl;
process.env.NEXT_PUBLIC_SUPABASE_URL = apiUrl;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey;
process.env.SUPABASE_SERVICE_ROLE_KEY = serviceKey;

run("npx prisma generate");
run("npx prisma db push");
run("npx tsx prisma/seed.ts");

console.log("Supabase is ready.");
console.log(`API: ${apiUrl}`);
console.log("Studio: http://127.0.0.1:54323");
console.log("Env updated in .env");
