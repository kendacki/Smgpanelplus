# SMG Panel

Production-ready SMM panel for African creators, brands and resellers. Inspired by panels like [TheKclaut](https://thekclaut.com/), built with SMG’s black-and-orange brand.

## Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4
- Prisma + SQLite (swap `DATABASE_URL` for PostgreSQL in production)
- JWT httpOnly sessions (`jose`) + bcrypt passwords
- Reseller API compatible with SMM panel v2

## Quick start

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

| Role  | Username | Password      |
|-------|----------|---------------|
| User  | `demo`   | `Password123!` |
| Admin | `admin`  | `Admin123!`    |

The demo user starts with ₦50,000. Use **Add Funds → Demo Credit** for instant wallet top-ups.

## Features

- Marketing site: hero, currency switcher, services, blog, FAQ, testimonials, child panel, API docs
- Auth: register, login, remember me, session cookies
- User dashboard: new order, mass order, order history, wallet, tickets, API key, settings
- Payments: Paystack/Flutterwave (instant demo), M-Pesa, MoMo, bank, USDT, demo credit
- Currencies: NGN, USD, GHS, KES
- Admin: users, orders, payments, refunds
- Public reseller API at `POST /api/v2`

## Environment

Copy `.env.example` and set a long `AUTH_SECRET` before production.

For PostgreSQL:

```
DATABASE_URL="postgresql://user:pass@host:5432/smg"
```

Then change `provider` in `prisma/schema.prisma` to `postgresql`.
