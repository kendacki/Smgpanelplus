import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const API = "https://api.supabase.com/v1";
const REF = "rkomxdfynajyvtrflafa";
const envPath = ".env";
const examplePath = ".env.example";

function accessToken() {
  const env = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (env) return env;
  const home = process.env.USERPROFILE || process.env.HOME || "";
  for (const file of [`${home}\\.supabase\\access-token`, `${home}/.supabase/access-token`]) {
    if (existsSync(file)) return readFileSync(file, "utf8").trim();
  }
  throw new Error("No Supabase access token");
}

function dbPassword() {
  if (process.env.SUPABASE_DB_PASSWORD?.trim()) return process.env.SUPABASE_DB_PASSWORD.trim();
  const temp = process.env.TEMP || process.env.TMP || "";
  const file = `${temp}\\smg-db-pass.txt`;
  if (existsSync(file)) return readFileSync(file, "utf8").trim();
  throw new Error("No database password");
}

async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function upsertEnv(path, values) {
  let text = existsSync(path) ? readFileSync(path, "utf8") : "";
  if (text && !text.endsWith("\n")) text += "\n";
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}="${String(value).replaceAll('"', '\\"')}"`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    if (pattern.test(text)) text = text.replace(pattern, line);
    else text += `${line}\n`;
  }
  writeFileSync(path, text);
}

function run(command) {
  const result = spawnSync(command, { stdio: "inherit", env: process.env, shell: true });
  if (result.status !== 0) throw new Error(`${command} failed`);
}

const password = dbPassword();
const keys = await api(`/projects/${REF}/api-keys`);
const anon = keys.find((k) => k.name === "anon" || k.tags === "anon")?.api_key;
const service = keys.find((k) => k.name === "service_role" || k.tags === "service_role")?.api_key;
if (!anon || !service) throw new Error("Could not read API keys");

const url = `https://${REF}.supabase.co`;
const encoded = encodeURIComponent(password);
const dbUrl = `postgresql://postgres.${REF}:${encoded}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require`;
const directUrl = `postgresql://postgres.${REF}:${encoded}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require`;

upsertEnv(envPath, {
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: anon,
  SUPABASE_SERVICE_ROLE_KEY: service,
  SUPABASE_DB_PASSWORD: password,
  DATABASE_URL: dbUrl,
  DIRECT_URL: directUrl,
});
upsertEnv(examplePath, {
  NEXT_PUBLIC_SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "your-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "your-service-role-key",
  DATABASE_URL: "postgresql://postgres.YOUR-PROJECT:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require",
});

try {
  await api(`/projects/${REF}/config/auth`, {
    method: "PATCH",
    body: JSON.stringify({
      site_url: "http://localhost:3000",
      uri_allow_list:
        "http://localhost:3000/**,https://smgpanelplus.com/**,http://localhost:3000/auth/callback,https://smgpanelplus.com/auth/callback",
      mailer_autoconfirm: true,
      disable_signup: false,
      external_email_enabled: true,
    }),
  });
  console.log("Auth autoconfirm enabled");
} catch (error) {
  console.warn("Auth patch:", error.message);
}

const supabase = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) throw listError;
if (!buckets?.some((bucket) => bucket.name === "uploads")) {
  const { error } = await supabase.storage.createBucket("uploads", {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
  });
  if (error) throw error;
  console.log("Created storage bucket: uploads");
} else {
  console.log("Storage bucket uploads already exists");
}

process.env.DATABASE_URL = directUrl;
process.env.DIRECT_URL = directUrl;
process.env.NEXT_PUBLIC_SUPABASE_URL = url;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anon;
process.env.SUPABASE_SERVICE_ROLE_KEY = service;

run("npx prisma generate");
try {
  run("npx prisma db push");
} catch {
  process.env.DATABASE_URL = dbUrl;
  run("npx prisma db push");
}
process.env.DATABASE_URL = dbUrl;
run("npx tsx prisma/seed.ts");

console.log(`Supabase URL: ${url}`);
console.log("Hosted auth, storage, and Postgres are connected.");
