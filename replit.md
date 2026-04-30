# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/scripts run seed:pakmart` — seed PakMart catalog data

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- `artifacts/api-server` — Express 5 API at `/api`. Cookie-based session middleware powers per-visitor carts (`pakmart_sid` cookie). Routes for home feed, categories, brands, products, deals, testimonials, cart, orders, and a sandbox payments processor (`/payments/card`, `/payments/mobile`) that mirrors a real PSP (Luhn check, brand detect, expiry validation, simulated decline for cards/wallets ending `0000`).
- `artifacts/mockup-sandbox` — Vite design canvas at `/__mockup` for component prototypes (PakMart Home mockup lives here).
- `artifacts/pakmart` — React + Vite e-commerce storefront at `/`. Pakistan-focused marketplace with home, shop, category filters, product detail, search, cart, checkout, order confirmation, and flash deals. Checkout supports COD, Credit/Debit Card (with formatted card form, brand detection), Easypaisa, and JazzCash; prepaid methods run through the sandbox payments processor and store `paymentStatus`, `transactionId`, `cardBrand`, `cardLast4`, `paymentMobile` on the order. Checkout accepts a `?pm=card|easypaisa|jazzcash` query param to deep-link to a payment method. Uses Playfair Display + Inter, cream/emerald/saffron palette, generated hooks from `@workspace/api-client-react`.

## Database (PakMart)

Drizzle schemas in `lib/db/src/schema/`: `categories`, `brands`, `products`, `cart_items` (session-scoped), `orders` (with denormalised item snapshots in JSONB plus payment columns: `paymentStatus`, `transactionId`, `cardBrand`, `cardLast4`, `paymentMobile`), `testimonials`. Seed data in `scripts/src/seed-pakmart.ts`.
