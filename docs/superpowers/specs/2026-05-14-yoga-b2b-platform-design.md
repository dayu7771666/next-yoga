# B2B Yoga Customization Platform - Design Spec

## Overview

A B2B yoga product showcase website targeting international designers and brands. The platform provides one-stop customization services (yoga apparel + accessories, including logo and packaging). Core value: fast turnaround, low MOQ, leveraging supply chain advantages to solve the pain point of designers not being able to quickly see physical samples.

The site is primarily a **showcase + lead generation** platform — products display for marketing and SEO, inquiries come through a simple contact form, no e-commerce checkout.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (via Supabase) |
| ORM | Prisma |
| Caching | Next.js 16 Cache Components (`use cache` + `cacheTag`) |
| Auth | Simple session/cookie for single admin user |
| Image Hosting | External service (Cloudinary/Uploadthing) |
| Blog Editor | Simple Markdown editor (textarea) |
| Deployment | Vercel + Supabase PostgreSQL |

- **`cacheComponents: true`** enabled in Next.js config for PPR (Partial Prerendering)
- Product and blog pages use `use cache` directive for optimal performance
- Admin content updates trigger `revalidateTag` for cache invalidation
- Inquiry submissions are real-time writes (no caching)

## Database Schema

### Products
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| title | String | Product name |
| slug | String | URL-friendly, unique |
| description | Text | Product description |
| category | Enum | `apparel` or `accessories` |
| images | JSON | Array of image URLs |
| features | JSON | Key features list |
| materials | String | Material info |
| sizes | String | Available sizes |
| min_order | String | MOQ info |
| price_range | String | Price reference range |
| lead_time | String | Production time |
| seo_title | String | Meta title |
| seo_description | String | Meta description |
| published | Boolean | Published/draft status |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

### Blog Posts
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| title | String | Post title |
| slug | String | URL-friendly, unique |
| excerpt | Text | Short summary |
| content | Text | Markdown content |
| cover_image | String | Cover image URL |
| author | String | Author name |
| tags | JSON | Array of tags |
| published | Boolean | Published/draft status |
| seo_title | String | Meta title |
| seo_description | String | Meta description |
| published_at | DateTime | When published |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

### Inquiries
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | String | Contact name |
| phone | String | Phone number |
| message | Text | Inquiry message |
| product_id | UUID? | Optional product reference |
| status | Enum | `new`, `contacted`, `closed` |
| created_at | DateTime | Auto |

### Admin User
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| username | String | Unique |
| password_hash | String | Hashed password |

## Route & Page Structure

### Public Pages
| Route | Page |
|-------|------|
| `/` | Homepage — brand intro, advantages, featured products, recent blog |
| `/products` | Product listing — filterable by category (apparel/accessories) |
| `/products/[slug]` | Product detail — images, specs, customization info, inquiry CTA |
| `/blog` | Blog listing — paginated, sortable by date/tag |
| `/blog/[slug]` | Blog detail — full article |
| `/contact` | Inquiry form — name, phone, message |
| `/about` | About us — supply chain story, process, advantages |

### Admin Pages
| Route | Page |
|-------|------|
| `/admin/login` | Admin login |
| `/admin` | Dashboard — counts (products, posts, new inquiries) |
| `/admin/products` | Product list + create/edit/delete |
| `/admin/blog` | Blog post list + create/edit/delete |
| `/admin/inquiries` | Inquiry list + status management |

## Key Design Decisions

### Caching Strategy
- Product list, product detail, blog list, blog detail pages use `'use cache'` with tags
- Cache tags per content type: `'products'`, `'posts'`
- Admin mutations call `revalidateTag` to invalidate affected caches
- Homepage cached similarly with `'home'` tag

### Admin Auth
- Simple session-based: admin login sets httpOnly cookie
- Middleware checks auth status for `/admin/*` routes (except `/admin/login`)
- Single admin user (seeded via database)

### SEO
- Per-page custom `seo_title` and `seo_description` (managed in admin)
- Auto-generated `sitemap.xml` via Next.js built-in
- Semantic URL slugs
- Structured data (Product Schema) on product detail pages
- Open Graph / Twitter Card meta tags via `generateMetadata`

### Images
- Stored on external service (Cloudinary/Uploadthing)
- Admin upload generates URL, stored in database JSON field
- Next.js `Image` component for optimized loading

### Inquiry Flow
1. User fills form (name, phone, message, optional product ref) on contact or product page
2. Server Action creates inquiry record in database
3. Admin can view and manage inquiries in admin panel

## Design Principles
- **Single responsibility:** Each component has one clear purpose
- **Isolation:** Public pages and admin pages are clearly separated
- **Progressive enhancement:** Core content works without JavaScript
- **Cache-first:** Static shell + cached content for optimal performance
