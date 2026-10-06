import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const API = "https://api.supabase.com/v1";
const envPath = ".env";
const examplePath = ".env.example";

function token() {
  const env = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (env) return env;
  const home = process.env.USERPROFILE || process.env.HOME || "";
  const candidates = [
    `${home}\\.supabase\\access-token`,
    `${home}/.supabase/access-token`,
  ];
  for (const file of candidates) {
    if (existsSync(file)) return readFileSync(file, "utf8").trim();
  }
  throw new Error("No Supabase access token. Run npx supabase login or set SUPABASE_ACCESS_TOKEN.");
}

async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${path} ${res.status}: ${text.slice(0, 400)}`);
  }
  return data;
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

function randomPassword() {
  return `Smg${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}A1!`;
}

const projects = await api("/projects");
let project = Array.isArray(projects)
  ? projects.find((item) => item.name === "smg-panel" || item.name === "SMG Panel")
  : null;

if (!project) {
  const orgs = await api("/organizations");
  if (!Array.isArray(orgs) || orgs.length === 0) {
    throw new Error("No Supabase organizations on this account");
  }
  const org = orgs[0];
  const dbPass = randomPassword();
  console.log(`Creating project smg-panel in org ${org.name}...`);
  project = await api("/projects", {
    method: "POST",
    body: JSON.stringify({
      name: "smg-panel",
      organization_id: org.id,
      region: "eu-west-1",
      db_pass: dbPass,
      plan: "free",
    }),
  });
  upsertEnv(envPath, { SUPABASE_DB_PASSWORD: dbPass });
  console.log("Waiting for project to become active...");
  for (let i = 0; i < 40; i += 1) {
    await new Promise((r) => setTimeout(r, 15000));
    const latest = (await api("/projects")).find((item) => item.id === project.id);
    if (latest?.status === "ACTIVE_HEALTHY" || latest?.status === "ACTIVE_UNHEALTHY" || latest?.status === "ACTIVE") {
      project = latest;
      break;
    }
    console.log(`status: ${latest?.status || "unknown"}`);
  }
}

const ref = project.id;
console.log(`Project ref ${ref} status ${project.status}`);

const keys = await api(`/projects/${ref}/api-keys`);
const anon = keys.find((k) => k.name === "anon" || k.tags === "anon")?.api_key;
const service = keys.find((k) => k.name === "service_role" || k.tags === "service_role")?.api_key;
if (!anon || !service) throw new Error("Could not read API keys");

const url = `https://${ref}.supabase.co`;
let password =
  process.env.SUPABASE_DB_PASSWORD?.trim() ||
  (existsSync(".env")
    ? (readFileSync(".env", "utf8").match(/^SUPABASE_DB_PASSWORD="([^"]+)"/m)?.[1] || "")
    : "");
if (!password) {
  password = randomPassword();
  await api(`/projects/${ref}/database/password`, {
    method: "PATCH",
    body: JSON.stringify({ password }),
  });
  upsertEnv(envPath, { SUPABASE_DB_PASSWORD: password });
  console.log("Reset database password");
}

let dbHost = `aws-0-${project.region || "eu-west-1"}.pooler.supabase.com`;
let dbUser = `postgres.${ref}`;
try {
  const pooler = await api(`/projects/${ref}/config/database/pooler`);
  if (pooler?.db_host) dbHost = pooler.db_host;
  if (pooler?.db_user) dbUser = pooler.db_user;
} catch {
  // use constructed pooler host
}
const encoded = encodeURIComponent(password);
const dbUrl = `postgresql://${dbUser}:${encoded}@${dbHost}:6543/postgres?pgbouncer=true&sslmode=require`;
const directUrl = `postgresql://${dbUser}:${encoded}@${dbHost}:5432/postgres?sslmode=require`;

const envValues = {
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: anon,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: anon,
  SUPABASE_SERVICE_ROLE_KEY: service,
  SUPABASE_DB_PASSWORD: password,
  DATABASE_URL: dbUrl,
  DIRECT_URL: directUrl,
};

upsertEnv(envPath, envValues);
upsertEnv(examplePath, {
  NEXT_PUBLIC_SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "your-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "your-service-role-key",
  DATABASE_URL: "postgresql://postgres.YOUR-PROJECT:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require",
});

try {
  await api(`/projects/${ref}/config/auth`, {
    method: "PATCH",
    body: JSON.stringify({
      site_url: "http://localhost:3000",
      uri_allow_list:
        "http://localhost:3000/**,https://smgpanelplus.com/**,http://localhost:3000/auth/callback,https://smgpanelplus.com/auth/callback",
      mailer_autoconfirm: true,
      disable_signup: false,
    }),
  });
} catch (error) {
  console.warn("Could not patch auth config:", error.message);
}

const supabase = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data: buckets } = await supabase.storage.listBuckets();
if (!buckets?.some((bucket) => bucket.name === "uploads")) {
  const { error } = await supabase.storage.createBucket("uploads", {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
  });
  if (error) console.warn("Bucket:", error.message);
  else console.log("Created storage bucket: uploads");
} else {
  console.log("Storage bucket uploads already exists");
}

process.env.NEXT_PUBLIC_SUPABASE_URL = url;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anon;
process.env.SUPABASE_SERVICE_ROLE_KEY = service;
process.env.DATABASE_URL = directUrl;

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
console.log("Sign-in, sign-up, and storage are pointed at this project.");
