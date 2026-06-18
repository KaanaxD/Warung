# Warung — AGENTS.md

Single-package Express 5 + TypeScript backend in `backend/`. PostgreSQL via raw SQL through `pg` Pool. Vitest for tests.

## Commands

```sh
# All commands must be run from backend/
cd backend

npm run dev        # tsx watch src/index.ts
npm test           # vitest (no config needed — uses defaults)
npm run test:watch # vitest --watch
npm start          # node dist/index.js (production)
```

No lint or typecheck scripts exist.

## Architecture (router → controller → service → repository → pg Pool)

```
src/
  index.ts          — entrypoint, app setup, CORS (origin: localhost:5173), rate limiting
  config/           — pg.ts (Pool), rateLimiter.ts, upload.ts (multer)
  routers/          — 4 files: auth, item (admin), view (public), logs (admin)
  controllers/      — thin request/response handling
  services/         — business logic, error creation
  repository/       — raw SQL queries
  utils/            — imgConvert.ts (sharp → webp), logger.ts
  global.d.ts       — global interfaces (Item, ItemLog, Pagination, etc.)
migrations/         — raw SQL files, apply manually
uploads/            — uploaded images (gitignored)
```

## API structure

| Route | Auth | Description |
|---|---|---|
| `POST /api/auth/login` | No (rate limited: 5/15min) | Returns JWT |
| `GET /api/view/item[/:id]` | No | Public item read |
| `GET /api/view/item/search?keyword=` | No | Public item search |
| `GET/POST/PUT/DELETE /api/admin/item/*` | JWT Bearer | Admin CRUD |
| `PATCH /api/admin/item/:id/upload` | JWT Bearer | Upload item image |
| `GET /api/admin/logs/*` | JWT Bearer | Read audit logs |
| `GET /api/img/*` | No | Static file serving of uploads/ |

General rate limit: 1000 req/15min on `/api/*`.

## Testing quirks

- Tests mock `pool.query` directly via `vi.mock("../config/pg", ...)`
- No integration tests or DB setup needed — purely unit tests against mocked pool
- Run with `npm test` in `backend/`

## Database

- PostgreSQL connection via `DB_URL` env var
- Two tables: `item` (id, nama, kategori, img_address, updated_at) and `item_log` (admin audit trail with JSONB old/new_data)
- Apply migrations manually: `psql $DB_URL -f migrations/001_init_users.sql`

## Auth

- Static credentials from env (`ADMIN_USERNAME`, `ADMIN_PASS`, `JWT_SECRET`)
- JWT expires in 10 days
- Token sent as `Authorization: Bearer <token>`

## Image upload flow

1. multer saves to `uploads/` with `Date.now() + ext` filename
2. `sharp` converts to webp (1200px, quality 75) and deletes original
3. Old image is removed from `uploads/` on update/delete

## Conventions

- Responses use `{ success: boolean, message: string, data?: any, token?: string }`
- Errors are thrown via `createError(status, message)` and caught by `errorHandler` middleware
- Zod validation on item POST/PUT (nama & kategori min 3 chars)
- Repository functions return factory objects (not classes): `itemRepository().getAllQuery()`
