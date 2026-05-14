# B2B Yoga Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a B2B yoga customization showcase website with product/blog display, admin management, and inquiry lead generation.

**Architecture:** Single Next.js 16 app with Cache Components (PPR mode). PostgreSQL via Prisma ORM. Admin routes under `/admin` with simple session auth. Product/blog pages use `use cache` + `cacheTag` for optimal SEO performance.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Prisma, PostgreSQL (Supabase)

---

## File Structure

```
next-yoga/
├── prisma/
│   └── schema.prisma              # Database schema
├── lib/
│   ├── db.ts                      # Prisma client singleton
│   ├── auth.ts                    # Admin session utilities
│   └── actions/
│       ├── products.ts            # Product server actions
│       ├── blog.ts                # Blog post server actions
│       └── inquiries.ts           # Inquiry server actions
├── app/
│   ├── globals.css                # Global styles (modify)
│   ├── layout.tsx                 # Root layout (modify)
│   ├── page.tsx                   # Homepage (modify)
│   ├── sitemap.ts                 # SEO sitemap
│   ├── products/
│   │   ├── page.tsx               # Product listing
│   │   └── [slug]/page.tsx        # Product detail
│   ├── blog/
│   │   ├── page.tsx               # Blog listing
│   │   └── [slug]/page.tsx        # Blog detail
│   ├── contact/page.tsx           # Contact/inquiry page
│   ├── about/page.tsx             # About page
│   └── admin/
│       ├── login/page.tsx         # Admin login
│       ├── layout.tsx             # Admin layout (auth guard)
│       ├── page.tsx               # Admin dashboard
│       ├── products/
│       │   ├── page.tsx           # Product list management
│       │   ├── new/page.tsx       # Create product
│       │   └── [id]/page.tsx      # Edit product
│       ├── blog/
│       │   ├── page.tsx           # Blog list management
│       │   ├── new/page.tsx       # Create blog post
│       │   └── [id]/page.tsx      # Edit blog post
│       └── inquiries/
│           └── page.tsx           # Inquiry management
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── BlogCard.tsx
│   ├── InquiryForm.tsx
│   ├── MarkdownRenderer.tsx
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── ProductForm.tsx
│       ├── BlogForm.tsx
│       └── InquiryTable.tsx
├── middleware.ts                  # Admin auth middleware
├── next.config.ts                 # Enable cache components
└── package.json                   # Add dependencies
```

---

### Task 1: Project Scaffolding & Dependencies

**Files:**
- Modify: `next.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

Run:
```bash
npm install prisma @prisma/client @prisma/extension-accelerate
npm install -D @types/bcryptjs
npm install bcryptjs jose
```

- [ ] **Step 2: Initialize Prisma**

Run:
```bash
npx prisma init
```

- [ ] **Step 3: Enable Cache Components in next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

- [ ] **Step 4: Set up PostCSS for Tailwind v4**

Read `postcss.config.mjs` — it should already use `@tailwindcss/postcss`. If not:

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold project with Prisma and Next.js 16 cache components"
```

---

### Task 2: Database Schema

**Files:**
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Write Prisma schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProductCategory {
  apparel
  accessories
}

enum InquiryStatus {
  new
  contacted
  closed
}

model Product {
  id            String           @id @default(cuid())
  title         String
  slug          String           @unique
  description   String
  category      ProductCategory
  images        String           @default("[]") // JSON array of URLs
  features      String           @default("[]") // JSON array
  materials     String?
  sizes         String?
  minOrder      String           @default("1 piece")
  priceRange    String?
  leadTime      String           @default("7-15 days")
  seoTitle      String?
  seoDescription String?
  published     Boolean          @default(false)
  inquiries     Inquiry[]
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
}

model BlogPost {
  id            String           @id @default(cuid())
  title         String
  slug          String           @unique
  excerpt       String?
  content       String           // Markdown
  coverImage    String?
  author        String           @default("Admin")
  tags          String           @default("[]") // JSON array
  published     Boolean          @default(false)
  seoTitle      String?
  seoDescription String?
  publishedAt   DateTime?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
}

model Inquiry {
  id            String           @id @default(cuid())
  name          String
  phone         String
  message       String
  status        InquiryStatus    @default(new)
  productId     String?
  product       Product?         @relation(fields: [productId], references: [id])
  createdAt     DateTime         @default(now())
}

model AdminUser {
  id           String           @id @default(cuid())
  username     String           @unique
  passwordHash String
  createdAt    DateTime         @default(now())
}
```

- [ ] **Step 2: Create .env with DATABASE_URL placeholder**

Write to `.env`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/next-yoga?schema=public"
```

- [ ] **Step 3: Run Prisma migration**

```bash
npx prisma migrate dev --name init
```

- [ ] **Step 4: Commit**

```bash
git add prisma/ .env
git commit -m "feat: add Prisma schema with Product, BlogPost, Inquiry, AdminUser models"
```

---

### Task 3: Prisma Client & Auth Utilities

**Files:**
- Create: `lib/db.ts`
- Create: `lib/auth.ts`

- [ ] **Step 1: Create Prisma singleton**

```typescript
// lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 2: Create auth utilities**

```typescript
// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
);

const SESSION_COOKIE = "admin_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(username: string) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.username as string;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<boolean> {
  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) return false;
  return verifyPassword(password, user.passwordHash);
}
```

- [ ] **Step 3: Seed admin user**

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
    },
  });
  console.log("Seed: admin user created (username: admin, password: admin123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

Update `package.json` to add seed config:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Run:
```bash
npm install -D tsx
npx prisma db seed
```

- [ ] **Step 4: Commit**

```bash
git add lib/ prisma/seed.ts package.json
git commit -m "feat: add Prisma client singleton, auth utilities, and admin seed"
```

---

### Task 4: Admin Auth Middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create middleware for admin route protection**

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add admin auth middleware"
```

---

### Task 5: Shared Components — Header & Footer

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `components/Header.tsx`
- Create: `components/Footer.tsx`

- [ ] **Step 1: Update global styles**

Replace `app/globals.css`:
```css
@import "tailwindcss";

:root {
  --color-primary: #7c3aed;
  --color-primary-light: #a78bfa;
  --color-secondary: #10b981;
}

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 2: Create Header component**

```typescript
// components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-purple-700">
          YogaCustom
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-600 hover:text-purple-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white">
          <div className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-600 hover:text-purple-700"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 3: Create Footer component**

```typescript
// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-zinc-400">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">YogaCustom</h3>
            <p className="text-sm leading-relaxed">
              One-stop yoga customization service for designers and brands.
              Low MOQ, fast turnaround, premium quality.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/products" className="hover:text-white transition-colors">Products</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <div className="text-sm leading-relaxed">
              <p>Email: info@yogacustom.com</p>
              <p>WhatsApp: +86-123-4567-8900</p>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-xs">
          &copy; {currentYear} YogaCustom. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Update root layout**

Modify `app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "YogaCustom — Premium Yoga Apparel & Accessories Customization",
    template: "%s | YogaCustom",
  },
  description:
    "One-stop yoga customization for designers and brands. Low MOQ, fast turnaround. Custom yoga apparel, mats, and accessories with your logo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

Also add TypeScript path alias. Read `tsconfig.json` and ensure it has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx components/ tsconfig.json
git commit -m "feat: add Header, Footer shared components and update root layout"
```

---

### Task 6: Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace homepage with showcase design**

Modify `app/page.tsx`:
```typescript
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const products = await getFeaturedProducts();
  const posts = await getLatestPosts();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">
              Custom Yoga Wear for{" "}
              <span className="text-purple-700">Designers & Brands</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
              From concept to sample in days, not months. One-piece minimum order.
              Custom logos, packaging, and full-brand solutions for yoga
              apparel and accessories.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
              >
                Explore Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg font-medium hover:bg-zinc-50 transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-zinc-900">
            Why Choose YogaCustom
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((adv) => (
              <div key={adv.title} className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto text-purple-700 text-2xl">
                  {adv.icon}
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">{adv.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-20 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-900">
                Featured Products
              </h2>
              <Link
                href="/products"
                className="text-sm font-medium text-purple-700 hover:text-purple-800"
              >
                View All →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog */}
      {posts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-900">Latest Blog</h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-purple-700 hover:text-purple-800"
              >
                View All →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const advantages = [
  {
    icon: "✦",
    title: "One-Piece MOQ",
    description:
      "Order as little as one piece for samples. Test your designs before committing to bulk production.",
  },
  {
    icon: "↻",
    title: "Fast Turnaround",
    description:
      "Sample production in 3-5 days, bulk orders in 7-15 days. From design to delivery in record time.",
  },
  {
    icon: "◎",
    title: "Full Customization",
    description:
      "Custom logos, packaging, tags, and labels. We handle every detail so your brand stands out.",
  },
];

async function getFeaturedProducts() {
  "use cache";
  const { prisma } = await import("@/lib/db");
  return prisma.product.findMany({
    where: { published: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

async function getLatestPosts() {
  "use cache";
  const { prisma } = await import("@/lib/db");
  return prisma.blogPost.findMany({
    where: { published: true },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });
}

// Inline mini cards to avoid cross-file dependency during initial build
function ProductCard({ product }: { product: { slug: string; title: string; images: string; category: string; description: string } }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center text-zinc-400">
        {product.images && JSON.parse(product.images).length > 0 ? (
          <img
            src={JSON.parse(product.images)[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-purple-700 uppercase tracking-wider">{product.category}</span>
        <h3 className="mt-1 font-semibold text-zinc-900 group-hover:text-purple-700 transition-colors">{product.title}</h3>
        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{product.description}</p>
      </div>
    </Link>
  );
}

function BlogCard({ post }: { post: { slug: string; title: string; coverImage: string | null; excerpt: string | null } }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/9] bg-zinc-100 flex items-center justify-center text-zinc-400">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-900 group-hover:text-purple-700 transition-colors">{post.title}</h3>
        {post.excerpt && <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{post.excerpt}</p>}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: implement homepage with hero, advantages, featured products and blog"
```

---

### Task 7: Product Pages

**Files:**
- Create: `app/products/page.tsx`
- Create: `app/products/[slug]/page.tsx`
- Create: `components/ProductCard.tsx`
- Create: `components/InquiryForm.tsx`

- [ ] **Step 1: Create ProductCard component**

```typescript
// components/ProductCard.tsx
import Link from "next/link";

type ProductCardProps = {
  product: {
    slug: string;
    title: string;
    images: string;
    category: string;
    description: string;
    priceRange: string | null;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const images: string[] = JSON.parse(product.images || "[]");

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center text-zinc-400 overflow-hidden">
        {images[0] ? (
          <img
            src={images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-purple-700 uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="mt-1 font-semibold text-zinc-900 group-hover:text-purple-700 transition-colors">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
          {product.description}
        </p>
        {product.priceRange && (
          <p className="mt-2 text-sm font-medium text-emerald-600">
            {product.priceRange}
          </p>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create inquiry form component**

```typescript
// components/InquiryForm.tsx
"use client";

import { submitInquiry } from "@/lib/actions/inquiries";
import { useActionState } from "react";

export default function InquiryForm({ productId }: { productId?: string }) {
  const [state, action, pending] = useActionState(submitInquiry, null);

  return (
    <form action={action} className="bg-zinc-50 rounded-xl p-6 border border-zinc-200">
      <h3 className="text-lg font-semibold text-zinc-900">Get a Quote</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Tell us about your needs and we&apos;ll get back to you within 24 hours.
      </p>

      {state?.success ? (
        <p className="mt-4 text-emerald-600 font-medium">
          Thank you! We&apos;ll contact you shortly.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {productId && (
            <input type="hidden" name="productId" value={productId} />
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
              Name *
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {state?.errors?.name && (
              <p className="mt-1 text-xs text-red-500">{state.errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
              Phone *
            </label>
            <input
              id="phone"
              name="phone"
              required
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {state?.errors?.phone && (
              <p className="mt-1 text-xs text-red-500">{state.errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-zinc-700">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe your requirements — product type, quantity, design needs..."
            />
            {state?.errors?.message && (
              <p className="mt-1 text-xs text-red-500">{state.errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full px-4 py-2.5 bg-purple-700 text-white rounded-lg font-medium text-sm hover:bg-purple-800 disabled:opacity-50 transition-colors"
          >
            {pending ? "Sending..." : "Send Inquiry"}
          </button>
        </div>
      )}
    </form>
  );
}
```

- [ ] **Step 3: Create product listing page**

```typescript
// app/products/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Products — Custom Yoga Apparel & Accessories",
  description:
    "Browse our range of customizable yoga products. From premium yoga apparel to accessories, all available with your brand.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getProducts(category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">Our Products</h1>
      <p className="mt-2 text-zinc-600">
        Fully customizable yoga apparel and accessories for your brand.
      </p>

      {/* Category filters */}
      <div className="mt-8 flex gap-3">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !category
              ? "bg-purple-700 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          All
        </Link>
        <Link
          href="/products?category=apparel"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            category === "apparel"
              ? "bg-purple-700 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Apparel
        </Link>
        <Link
          href="/products?category=accessories"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            category === "accessories"
              ? "bg-purple-700 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Accessories
        </Link>
      </div>

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-zinc-400">No products found.</p>
      )}
    </div>
  );
}

async function getProducts(category?: string) {
  "use cache";
  return prisma.product.findMany({
    where: {
      published: true,
      ...(category ? { category: category as "apparel" | "accessories" } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}
```

- [ ] **Step 4: Create product detail page**

```typescript
// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import InquiryForm from "@/components/InquiryForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.description,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const images: string[] = JSON.parse(product.images || "[]");
  const features: string[] = JSON.parse(product.features || "[]");
  const tags: string[] = JSON.parse(product.tags || "[]");

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Images */}
        <div className="lg:col-span-3">
          <div className="aspect-[4/3] bg-zinc-100 rounded-xl overflow-hidden">
            {images[0] ? (
              <img
                src={images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-300">
                No image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <div key={i} className="w-20 h-20 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <span className="text-xs font-medium text-purple-700 uppercase tracking-wider">
            {product.category}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-zinc-900">{product.title}</h1>
          <p className="mt-4 text-zinc-600 leading-relaxed">{product.description}</p>

          <div className="mt-6 space-y-3 text-sm">
            {product.materials && (
              <div>
                <span className="font-medium text-zinc-900">Materials: </span>
                <span className="text-zinc-600">{product.materials}</span>
              </div>
            )}
            {product.sizes && (
              <div>
                <span className="font-medium text-zinc-900">Sizes: </span>
                <span className="text-zinc-600">{product.sizes}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-zinc-900">Min Order: </span>
              <span className="text-zinc-600">{product.minOrder}</span>
            </div>
            {product.priceRange && (
              <div>
                <span className="font-medium text-zinc-900">Price Range: </span>
                <span className="text-emerald-600 font-medium">{product.priceRange}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-zinc-900">Lead Time: </span>
              <span className="text-zinc-600">{product.leadTime}</span>
            </div>
          </div>

          {features.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-zinc-900">Features</h3>
              <ul className="mt-2 space-y-1">
                {features.map((f, i) => (
                  <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <InquiryForm productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

async function getProduct(slug: string) {
  "use cache";
  return prisma.product.findUnique({
    where: { slug, published: true },
  });
}
```

- [ ] **Step 5: Create inquiry server action**

```typescript
// lib/actions/inquiries.ts
"use server";

import { prisma } from "@/lib/db";

export async function submitInquiry(
  prevState: unknown,
  formData: FormData
): Promise<{
  success?: boolean;
  errors?: { name?: string; phone?: string; message?: string };
}> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;
  const productId = formData.get("productId") as string | null;

  const errors: { name?: string; phone?: string; message?: string } = {};

  if (!name || name.length < 2) errors.name = "Name is required";
  if (!phone || phone.length < 5) errors.phone = "Phone is required";
  if (!message || message.length < 10)
    errors.message = "Please provide at least 10 characters";

  if (Object.keys(errors).length > 0) return { errors };

  await prisma.inquiry.create({
    data: {
      name,
      phone,
      message,
      ...(productId ? { productId } : {}),
    },
  });

  return { success: true };
}
```

- [ ] **Step 6: Commit**

```bash
git add app/products/ lib/actions/ components/ProductCard.tsx components/InquiryForm.tsx
git commit -m "feat: implement product listing, detail pages, and inquiry form"
```

---

### Task 8: Blog Pages

**Files:**
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`
- Create: `components/BlogCard.tsx`
- Create: `components/MarkdownRenderer.tsx`

- [ ] **Step 1: Create BlogCard component**

```typescript
// components/BlogCard.tsx
import Link from "next/link";

type BlogCardProps = {
  post: {
    slug: string;
    title: string;
    coverImage: string | null;
    excerpt: string | null;
    publishedAt: Date | null;
    tags: string;
  };
};

export default function BlogCard({ post }: BlogCardProps) {
  const tags: string[] = JSON.parse(post.tags || "[]");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/9] bg-zinc-100 overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        {tags.length > 0 && (
          <div className="flex gap-2 mb-2">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-semibold text-zinc-900 group-hover:text-purple-700 transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create MarkdownRenderer component**

```typescript
// components/MarkdownRenderer.tsx
type MarkdownRendererProps = {
  content: string;
};

// Simple markdown-to-HTML renderer for basic content
// For production, consider using `react-markdown` or similar
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = content
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-4 rounded-lg w-full" />')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-purple-700 hover:underline">$1</a>')
    .replace(/^\- (.*$)/gm, '<li class="ml-4 list-disc text-zinc-600">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-zinc-600 leading-relaxed mb-4">')
    .replace(/^\n/, '')
    .trim();

  return (
    <div className="prose prose-zinc max-w-none">
      <p className="text-zinc-600 leading-relaxed">{html}</p>
    </div>
  );
}
```

- [ ] **Step 3: Create blog listing page**

```typescript
// app/blog/page.tsx
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog — Yoga Industry Insights & Customization Tips",
  description:
    "Explore the latest in yoga fashion trends, customization guides, and brand success stories.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">Blog</h1>
      <p className="mt-2 text-zinc-600">
        Insights, guides, and stories from the yoga customization world.
      </p>

      {posts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-zinc-400">No posts yet.</p>
      )}
    </div>
  );
}

async function getPosts() {
  "use cache";
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}
```

- [ ] **Step 4: Create blog detail page**

```typescript
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
  };
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const tags: string[] = JSON.parse(post.tags || "[]");

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full aspect-video object-cover rounded-xl mb-8"
        />
      )}

      <h1 className="text-3xl font-bold text-zinc-900">{post.title}</h1>

      <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
        <span>{post.author}</span>
        <span>•</span>
        <span>
          {post.publishedAt?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
}

async function getPost(slug: string) {
  "use cache";
  return prisma.blogPost.findUnique({
    where: { slug, published: true },
  });
}
```

- [ ] **Step 5: Commit**

```bash
git add app/blog/ components/BlogCard.tsx components/MarkdownRenderer.tsx
git commit -m "feat: implement blog listing and detail pages"
```

---

### Task 9: Static Pages (Contact & About)

**Files:**
- Create: `app/contact/page.tsx`
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create contact page**

```typescript
// app/contact/page.tsx
import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Contact Us — Start Your Custom Yoga Project",
  description:
    "Ready to bring your yoga brand to life? Contact us for a free consultation and quote.",
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 text-center">Contact Us</h1>
        <p className="mt-2 text-zinc-600 text-center">
          Tell us about your project and we&apos;ll get back to you within 24 hours.
        </p>

        <div className="mt-8">
          <InquiryForm />
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
          <div className="p-4 bg-zinc-50 rounded-xl">
            <h3 className="font-medium text-zinc-900">Email</h3>
            <p className="mt-1 text-sm text-zinc-600">info@yogacustom.com</p>
          </div>
          <div className="p-4 bg-zinc-50 rounded-xl">
            <h3 className="font-medium text-zinc-900">WhatsApp</h3>
            <p className="mt-1 text-sm text-zinc-600">+86-123-4567-8900</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create about page**

```typescript
// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Your Trusted Yoga Customization Partner",
  description:
    "Learn about our supply chain advantages, quality commitment, and how we help brands bring their yoga product visions to life.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">About YogaCustom</h1>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-900">Our Story</h2>
        <p className="mt-4 text-zinc-600 leading-relaxed">
          YogaCustom was founded to bridge the gap between designer vision and
          physical product. We partner with premium manufacturers across Asia
          specializing in yoga apparel and accessory production, giving designers
          and brands direct access to industrial-grade supply chains.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">Our Advantage</h2>
        <div className="mt-6 space-y-6">
          {[
            {
              title: "Supply Chain Expertise",
              description:
                "Years of partnership with specialized yoga wear factories means we know exactly who can deliver quality at the right price point.",
            },
            {
              title: "One-Piece Sample Service",
              description:
                "Unlike traditional manufacturers demanding bulk orders, we support single-piece sampling so you can validate designs before committing.",
            },
            {
              title: "End-to-End Customization",
              description:
                "From fabric selection to logo embroidery, custom hang tags to packaging design — we handle every detail of your brand presentation.",
            },
            {
              title: "Quality Control",
              description:
                "Every order goes through multi-point inspection. We stand behind the quality of every piece we ship.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 bg-zinc-50 rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-zinc-900">Ready to Start?</h2>
        <p className="mt-2 text-zinc-600">
          Get in touch and we&apos;ll help you bring your yoga brand to life.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center px-6 py-2.5 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/contact/ app/about/
git commit -m "feat: implement contact and about pages"
```

---

### Task 10: Admin Layout & Login

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`
- Create: `app/admin/login/page.tsx`
- Create: `components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Create admin sidebar**

```typescript
// components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "■" },
  { href: "/admin/products", label: "Products", icon: "□" },
  { href: "/admin/blog", label: "Blog Posts", icon: "≡" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "◎" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-zinc-900 text-zinc-400 min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-zinc-800">
        <Link href="/admin" className="text-white font-bold">
          YogaCustom Admin
        </Link>
      </div>
      <nav className="flex-1 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-zinc-800">
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← View Site
        </Link>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create admin layout**

```typescript
// app/admin/layout.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminLogoutButton from "./AdminLogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-zinc-50">
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-end px-6">
          <AdminLogoutButton />
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create admin logout button**

```typescript
// app/admin/AdminLogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-zinc-500 hover:text-red-600 transition-colors"
    >
      Logout
    </button>
  );
}
```

- [ ] **Step 4: Create auth API route**

```typescript
// app/api/auth/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 5: Create admin login page**

```typescript
// app/admin/login/page.tsx
"use client";

import { authenticateUser, createSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    const valid = await authenticateUser(username, password);
    if (valid) {
      await createSession(username);
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid username or password");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl border border-zinc-200">
        <h1 className="text-xl font-bold text-zinc-900 text-center">Admin Login</h1>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-zinc-700">Username</label>
            <input
              id="username"
              name="username"
              required
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-purple-700 text-white rounded-lg font-medium text-sm hover:bg-purple-800 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 6: Create admin dashboard page**

```typescript
// app/admin/page.tsx
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, postCount, newInquiries] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.inquiry.count({ where: { status: "new" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-zinc-200">
          <p className="text-sm text-zinc-500">Products</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900">{productCount}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-zinc-200">
          <p className="text-sm text-zinc-500">Blog Posts</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900">{postCount}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-zinc-200">
          <p className="text-sm text-zinc-500">New Inquiries</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900">{newInquiries}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add app/admin/ components/admin/AdminSidebar.tsx app/api/auth/
git commit -m "feat: implement admin layout, login, and dashboard"
```

---

### Task 11: Admin Product Management

**Files:**
- Create: `lib/actions/products.ts`
- Create: `app/admin/products/page.tsx`
- Create: `app/admin/products/new/page.tsx`
- Create: `app/admin/products/[id]/page.tsx`
- Create: `components/admin/ProductForm.tsx`

- [ ] **Step 1: Create product server actions**

```typescript
// lib/actions/products.ts
"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = slugify(title);
  const description = formData.get("description") as string;
  const category = formData.get("category") as "apparel" | "accessories";
  const images = formData.get("images") as string || "[]";
  const features = formData.get("features") as string || "[]";
  const materials = formData.get("materials") as string;
  const sizes = formData.get("sizes") as string;
  const minOrder = formData.get("minOrder") as string || "1 piece";
  const priceRange = formData.get("priceRange") as string;
  const leadTime = formData.get("leadTime") as string || "7-15 days";
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const published = formData.get("published") === "on";

  await prisma.product.create({
    data: { title, slug, description, category, images, features, materials, sizes, minOrder, priceRange, leadTime, seoTitle, seoDescription, published },
  });

  revalidateTag("products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = slugify(title);
  const description = formData.get("description") as string;
  const category = formData.get("category") as "apparel" | "accessories";
  const images = formData.get("images") as string || "[]";
  const features = formData.get("features") as string || "[]";
  const materials = formData.get("materials") as string;
  const sizes = formData.get("sizes") as string;
  const minOrder = formData.get("minOrder") as string || "1 piece";
  const priceRange = formData.get("priceRange") as string;
  const leadTime = formData.get("leadTime") as string || "7-15 days";
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const published = formData.get("published") === "on";

  await prisma.product.update({
    where: { id },
    data: { title, slug, description, category, images, features, materials, sizes, minOrder, priceRange, leadTime, seoTitle, seoDescription, published },
  });

  revalidateTag("products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidateTag("products");
}
```

- [ ] **Step 2: Create ProductForm component**

```typescript
// components/admin/ProductForm.tsx
import { createProduct, updateProduct } from "@/lib/actions/products";

type ProductData = {
  id?: string;
  title: string;
  description: string;
  category: string;
  images: string;
  features: string;
  materials: string | null;
  sizes: string | null;
  minOrder: string;
  priceRange: string | null;
  leadTime: string;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
};

export default function ProductForm({ product }: { product?: ProductData }) {
  const action = product
    ? updateProduct.bind(null, product.id!)
    : createProduct;

  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Title *</label>
        <input
          name="title"
          required
          defaultValue={product?.title}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Category *</label>
        <select
          name="category"
          required
          defaultValue={product?.category || "apparel"}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="apparel">Apparel</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Description *</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Image URLs (JSON array, e.g. ["url1", "url2"])
        </label>
        <input
          name="images"
          defaultValue={product?.images || "[]"}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Features (JSON array)
        </label>
        <input
          name="features"
          defaultValue={product?.features || "[]"}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Materials</label>
          <input
            name="materials"
            defaultValue={product?.materials || ""}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Sizes</label>
          <input
            name="sizes"
            defaultValue={product?.sizes || ""}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Min Order</label>
          <input
            name="minOrder"
            defaultValue={product?.minOrder || "1 piece"}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Price Range</label>
          <input
            name="priceRange"
            defaultValue={product?.priceRange || ""}
            placeholder="$15-$50 USD"
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Lead Time</label>
          <input
            name="leadTime"
            defaultValue={product?.leadTime || "7-15 days"}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <details className="border border-zinc-200 rounded-lg p-4">
        <summary className="text-sm font-medium text-zinc-700 cursor-pointer">SEO Settings</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">SEO Title</label>
            <input
              name="seoTitle"
              defaultValue={product?.seoTitle || ""}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">SEO Description</label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={product?.seoDescription || ""}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </details>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={product?.published}
          className="rounded border-zinc-300 text-purple-700 focus:ring-purple-500"
        />
        <span className="text-sm font-medium text-zinc-700">Published</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          {product ? "Update Product" : "Create Product"}
        </button>
        <a
          href="/admin/products"
          className="px-4 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Create admin products list page**

```typescript
// app/admin/products/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteProduct } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800"
        >
          + New Product
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {products.length === 0 ? (
          <p className="p-6 text-zinc-400 text-center">No products yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 capitalize">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.published ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                    }`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-purple-700 hover:text-purple-800 mr-3"
                    >
                      Edit
                    </Link>
                    <form
                      action={deleteProduct.bind(null, p.id)}
                      className="inline"
                      onSubmit={(e) => {
                        if (!confirm("Delete this product?")) e.preventDefault();
                      }}
                    >
                      <button type="submit" className="text-red-500 hover:text-red-600">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create new product page**

```typescript
// app/admin/products/new/page.tsx
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">New Product</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create edit product page**

```typescript
// app/admin/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Edit Product</h1>
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/actions/products.ts app/admin/products/ components/admin/ProductForm.tsx
git commit -m "feat: implement admin product CRUD"
```

---

### Task 12: Admin Blog Management

**Files:**
- Create: `lib/actions/blog.ts`
- Create: `app/admin/blog/page.tsx`
- Create: `app/admin/blog/new/page.tsx`
- Create: `app/admin/blog/[id]/page.tsx`
- Create: `components/admin/BlogForm.tsx`

- [ ] **Step 1: Create blog server actions**

```typescript
// lib/actions/blog.ts
"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = slugify(title);
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const coverImage = formData.get("coverImage") as string;
  const author = formData.get("author") as string || "Admin";
  const tags = formData.get("tags") as string || "[]";
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const published = formData.get("published") === "on";

  await prisma.blogPost.create({
    data: {
      title, slug, excerpt, content, coverImage, author, tags,
      seoTitle, seoDescription, published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidateTag("posts");
  redirect("/admin/blog");
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = slugify(title);
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const coverImage = formData.get("coverImage") as string;
  const author = formData.get("author") as string || "Admin";
  const tags = formData.get("tags") as string || "[]";
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const published = formData.get("published") === "on";

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const now = new Date();

  await prisma.blogPost.update({
    where: { id },
    data: {
      title, slug, excerpt, content, coverImage, author, tags,
      seoTitle, seoDescription, published,
      publishedAt: published && !existing?.publishedAt ? now : existing?.publishedAt,
    },
  });

  revalidateTag("posts");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await prisma.blogPost.delete({ where: { id } });
  revalidateTag("posts");
}
```

- [ ] **Step 2: Create BlogForm component**

```typescript
// components/admin/BlogForm.tsx
import { createPost, updatePost } from "@/lib/actions/blog";

type BlogData = {
  id?: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  author: string;
  tags: string;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
};

export default function BlogForm({ post }: { post?: BlogData }) {
  const action = post ? updatePost.bind(null, post.id!) : createPost;

  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Title *</label>
        <input
          name="title"
          required
          defaultValue={post?.title}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Excerpt</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt || ""}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Content (Markdown) *</label>
        <textarea
          name="content"
          required
          rows={16}
          defaultValue={post?.content}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Cover Image URL</label>
          <input
            name="coverImage"
            defaultValue={post?.coverImage || ""}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Author</label>
          <input
            name="author"
            defaultValue={post?.author || "Admin"}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Tags (JSON array, e.g. ["yoga", "trends"])</label>
        <input
          name="tags"
          defaultValue={post?.tags || "[]"}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <details className="border border-zinc-200 rounded-lg p-4">
        <summary className="text-sm font-medium text-zinc-700 cursor-pointer">SEO Settings</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">SEO Title</label>
            <input
              name="seoTitle"
              defaultValue={post?.seoTitle || ""}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">SEO Description</label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={post?.seoDescription || ""}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </details>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published}
          className="rounded border-zinc-300 text-purple-700 focus:ring-purple-500"
        />
        <span className="text-sm font-medium text-zinc-700">Published</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          {post ? "Update Post" : "Create Post"}
        </button>
        <a
          href="/admin/blog"
          className="px-4 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Create admin blog list page**

```typescript
// app/admin/blog/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import { deletePost } from "@/lib/actions/blog";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800"
        >
          + New Post
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {posts.length === 0 ? (
          <p className="p-6 text-zinc-400 text-center">No posts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Author</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3">{p.author}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.published ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                    }`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/blog/${p.id}`} className="text-purple-700 hover:text-purple-800 mr-3">
                      Edit
                    </Link>
                    <form
                      action={deletePost.bind(null, p.id)}
                      className="inline"
                      onSubmit={(e) => {
                        if (!confirm("Delete this post?")) e.preventDefault();
                      }}
                    >
                      <button type="submit" className="text-red-500 hover:text-red-600">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create new blog post page**

```typescript
// app/admin/blog/new/page.tsx
import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">New Blog Post</h1>
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create edit blog post page**

```typescript
// app/admin/blog/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import BlogForm from "@/components/admin/BlogForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Edit Blog Post</h1>
      <div className="mt-6">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/actions/blog.ts app/admin/blog/ components/admin/BlogForm.tsx
git commit -m "feat: implement admin blog CRUD"
```

---

### Task 13: Admin Inquiry Management

**Files:**
- Create: `lib/actions/inquiries.ts` (add admin action)
- Create: `app/admin/inquiries/page.tsx`
- Create: `components/admin/InquiryTable.tsx`

- [ ] **Step 1: Add inquiry status action**

Append to `lib/actions/inquiries.ts`:
```typescript
// Add to existing lib/actions/inquiries.ts

export async function updateInquiryStatus(id: string, status: "contacted" | "closed") {
  await prisma.inquiry.update({ where: { id }, data: { status } });
}
```

- [ ] **Step 2: Create inquiry management page**

```typescript
// app/admin/inquiries/page.tsx
import { prisma } from "@/lib/db";
import { updateInquiryStatus } from "@/lib/actions/inquiries";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { title: true, slug: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Inquiries</h1>

      <div className="mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {inquiries.length === 0 ? (
          <p className="p-6 text-zinc-400 text-center">No inquiries yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Product</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Message</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{inq.name}</td>
                  <td className="px-4 py-3">{inq.phone}</td>
                  <td className="px-4 py-3">
                    {inq.product ? (
                      <a href={`/products/${inq.product.slug}`} target="_blank" className="text-purple-700 hover:underline">
                        {inq.product.title}
                      </a>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="truncate text-zinc-600">{inq.message}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                    {inq.createdAt.toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      inq.status === "new"
                        ? "bg-blue-100 text-blue-700"
                        : inq.status === "contacted"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-zinc-100 text-zinc-500"
                    }`}>
                      {inq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {inq.status === "new" && (
                      <form action={updateInquiryStatus.bind(null, inq.id, "contacted")} className="inline">
                        <button type="submit" className="text-amber-600 hover:text-amber-700 text-xs mr-2">
                          Mark Contacted
                        </button>
                      </form>
                    )}
                    {inq.status !== "closed" && (
                      <form action={updateInquiryStatus.bind(null, inq.id, "closed")} className="inline">
                        <button type="submit" className="text-red-500 hover:text-red-600 text-xs">
                          Close
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/inquiries/ lib/actions/inquiries.ts
git commit -m "feat: implement admin inquiry management"
```

---

### Task 14: SEO Setup (Sitemap & Metadata)

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Step 1: Create sitemap generation**

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || "https://yogacustom.com";

  const products = await prisma.product.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: add dynamic sitemap generation"
```

---

### Task 15: Build Verification & Final Touches

**Files:**
- Modify: `.gitignore` (ensure `.env` is ignored)

- [ ] **Step 1: Verify .gitignore includes .env**

Read `.gitignore` — ensure `.env` is listed. If not, add it.

- [ ] **Step 2: Type check and build**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors.

If there are errors, fix them (likely missing types or imports).

- [ ] **Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "chore: fix build issues and finalize setup"
```
