# SMG Panel

Production-ready SMM panel for African creators, brands and resellers. Inspired by panels like [TheKclaut](https://thekclaut.com/), built with SMG’s black-and-orange brand.

## Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4
- Supabase Auth, Postgres, and Storage
- Prisma against Supabase Postgres
- Reseller API compatible with SMM panel v2

## Quick start

Docker must be running. Then:

```bash
npm install
npm run supabase:setup
npm run dev
```

This starts local Supabase, writes `.env`, pushes the schema, and seeds demo users.

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

| Role  | Username | Password      |
|-------|----------|---------------|
| User  | `demo`   | `Password123!` |
| Admin | `admin`  | `Admin123!`    |

The demo user starts with 50 USDT. Use **Add Funds → Demo Credit** for instant wallet top-ups.

## Features

- Marketing site: hero, services, blog, FAQ, testimonials, child panel, API docs
- Auth: Supabase email/password sign in, sign up, and password reset
- User dashboard: new order, mass order, order history, wallet, tickets, API key, settings
- File uploads (avatars and ticket attachments) on Supabase Storage
- Payments: USDT (TRC20) deposits, plus demo credit for testing
- Currency: USDT only (matches AmazingSMM)
- Admin: users, orders, payments, refunds
- Public reseller API at `POST /api/v2`

## Environment

Copy `.env.example` and set a long `AUTH_SECRET` before production.

Add your AmazingSMM key so the panel can import services and fulfill orders:

```
AMAZINGSMM_API_URL="https://amazingsmm.com/api/v2"
AMAZINGSMM_API_KEY="your-amazingsmm-api-key"
PROVIDER_MARKUP="1.35"
```

Then sync the catalog:

```
npm run db:sync
```

Or sign in as admin and use **Provider → Sync service list**. Orders from the dashboard and `POST /api/v2` are sent to AmazingSMM.

Production site: [https://smgpanelplus.com](https://smgpanelplus.com)

On Vercel, set the same Supabase values from your hosted project:

```
NEXT_PUBLIC_APP_URL="https://smgpanelplus.com"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
DATABASE_URL="postgresql://postgres:PASSWORD@db.YOUR-PROJECT.supabase.co:5432/postgres"
```
