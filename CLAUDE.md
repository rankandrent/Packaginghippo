# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint check
npx prisma generate  # Regenerate Prisma client (run after schema changes)
npx prisma db push   # Push schema changes to MongoDB
```

No test suite is configured. Use `npm run build` to verify there are no TypeScript or build errors.

## Architecture

**Packaging Hippo** is a B2B packaging e-commerce platform with programmatic SEO, a full CMS, live chat, and an admin dashboard.

### Stack
- **Next.js 16** (App Router, no pages directory), **React 19**, **TypeScript** strict mode
- **MongoDB** via **Prisma ORM** — connection via `DATABASE_URL` env var
- **Tailwind CSS 4** + **Shadcn UI** (components in `src/components/ui/`)
- **Custom JWT auth** via `jose` (HS256, 7-day expiry) + `bcryptjs` password hashing
- **Cloudinary** for image hosting; images rewritten from `/images/:path*` → Cloudinary CDN in `next.config.ts`
- **Tiptap** for rich text editing in admin, **dnd-kit** for drag-and-drop section ordering

### Route Groups
- `src/app/(admin)/dashboard/` — protected admin dashboard (route group, no URL segment)
- `src/app/api/` — ~45 REST API routes; admin CMS under `/api/cms/*`, public under `/api/inquiry`, `/api/search`, `/api/orders`, `/api/chat/*`
- `src/app/[slug]/` — catch-all for dynamic category and CMS pages
- `src/app/dashboard/` — auth pages only (login, signup, forgot/reset password)

### Authentication & Middleware
- `src/middleware.ts` runs at the edge; verifies `admin-token` httpOnly cookie using `jose`
- Protects all `/dashboard/*` routes except auth pages
- Also handles **dynamic URL redirects**: fetches from `/api/redirect-lookup` → performs 301/302 redirects before serving pages; silently fails if lookup errors
- `src/lib/auth.ts` — JWT generation/verification, password hashing, validation utilities

### Database Layer
- `src/lib/db.ts` — Prisma singleton (global caching for dev hot-reload safety)
- `prisma/schema.prisma` — 16 models including `Product`, `ProductCategory`, `BlogPost`, `Order`, `Inquiry`, `ChatConversation`, `Redirect`, `PageTemplate`, `SiteSettings`, `HomepageSection`
- Many models store flexible content in JSON fields (`sections`, `layout`, `tabs`, `content`) for page builder functionality

### Key Libraries & Utilities
- `src/lib/utils.ts` — `cn()` (clsx + twMerge), `constructMetadataTitle()`
- `src/lib/cms.ts` — server-side content fetching with ISR revalidation
- `src/context/CartContext.tsx` — cart state via React Context, persisted to localStorage
- `src/components/admin/SectionBuilder.tsx` — dynamic page section builder used in product/category/homepage editors

### Content & SEO Patterns
- Products and categories use a `sections` JSON field for flexible page layouts managed by `SectionBuilder`
- Products have a `tabs` JSON field for specifications, materials, finishes, etc.
- All content models include `seoTitle`, `seoDesc`, `seoKeywords` fields
- `src/app/robots.ts` and `src/app/sitemap.ts` for SEO crawling
- JSON-LD schema components live in `src/components/schema/`

### Admin Dashboard Sections
Products, Categories, Blog (posts, categories, authors), Inquiries, Orders, Chat, Homepage sections, Testimonials, Redirects, SEO Audit, Settings, Page Templates

### Environment Variables Required
```
DATABASE_URL          # MongoDB connection string
JWT_SECRET            # JWT signing secret
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
OPENROUTER_API_KEY    # AI chat replies and testimonial generation
```

### ESLint Config Notes
`no-explicit-any` is off and `@next/next/no-img-element` is disabled. Unused vars emit warnings only. Do not tighten these rules without user intent.
