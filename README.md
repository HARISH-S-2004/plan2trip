# Plan2Trip - Travel Booking Website

A full-stack travel booking platform built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **shadcn/ui**. Features a public-facing travel site with package browsing and booking, plus a full admin dashboard for managing packages, bookings, users, and payments.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **Charts:** Recharts
- **Icons:** Lucide React
- **Fonts:** Inter (body) + Playfair Display (headings)

---

## Pages & Routes

### Public Pages

| Route | Description |
| --- | --- |
| `/` | Home page with hero, search bar, featured packages, why choose us, and testimonials |
| `/packages` | Package listing with sidebar filters (destination, price range, duration) |
| `/packages/[id]` | Package details with tabs (Overview, Itinerary, Inclusions, Exclusions) and booking CTA |
| `/booking/[id]` | Booking form with traveler details and price summary |
| `/bookings` | My Bookings page showing booking history with status badges |

### Admin Pages

| Route | Description |
| --- | --- |
| `/admin` | Dashboard with stat cards, revenue chart, bookings-by-destination chart, and recent bookings table |
| `/admin/packages` | Package management with search, add/edit/delete, and active/inactive toggle |
| `/admin/bookings` | Booking management with status filters and confirm/cancel actions |
| `/admin/users` | User management with role badges, block/unblock, and admin promotion |
| `/admin/payments` | Payment history with transaction table and export |
| `/admin/settings` | General settings and notification preferences |

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** >= 18.17.0
- **pnpm** >= 8.0 (recommended) or npm/yarn

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd plan2trip
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Run the Development Server

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the public site.

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to see the admin dashboard.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server with hot reload |
| `pnpm build` | Create an optimized production build |
| `pnpm start` | Start the production server (run `build` first) |
| `pnpm lint` | Run ESLint to check for code issues |

---

## Project Structure

```
plan2trip/
├── app/
│   ├── layout.tsx              # Root layout with fonts, navbar, footer
│   ├── globals.css             # Tailwind CSS 4 theme and design tokens
│   ├── page.tsx                # Home page
│   ├── packages/
│   │   ├── page.tsx            # Package listing page
│   │   └── [id]/page.tsx       # Package details page
│   ├── booking/
│   │   └── [id]/page.tsx       # Booking form page
│   ├── bookings/
│   │   └── page.tsx            # My Bookings page
│   └── admin/
│       ├── layout.tsx          # Admin layout (sidebar + topbar)
│       ├── page.tsx            # Admin dashboard
│       ├── packages/page.tsx   # Admin packages management
│       ├── bookings/page.tsx   # Admin bookings management
│       ├── users/page.tsx      # Admin users management
│       ├── payments/page.tsx   # Admin payments page
│       └── settings/page.tsx   # Admin settings page
├── components/
│   ├── navbar.tsx              # Public navigation bar
│   ├── footer.tsx              # Public footer
│   ├── home/                   # Home page sections
│   │   ├── hero-section.tsx
│   │   ├── featured-packages.tsx
│   │   ├── why-choose-us.tsx
│   │   └── testimonials.tsx
│   ├── packages/               # Package components
│   │   ├── package-listing.tsx
│   │   └── package-details.tsx
│   ├── booking/                # Booking components
│   │   ├── booking-form.tsx
│   │   └── my-bookings.tsx
│   ├── admin/                  # Admin components
│   │   ├── admin-sidebar.tsx
│   │   └── admin-topbar.tsx
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── data.ts                 # Public data (packages, testimonials, etc.)
│   ├── admin-data.ts           # Admin data (stats, users, payments, etc.)
│   ├── fonts.ts                # Font configuration (Inter + Playfair Display)
│   └── utils.ts                # Utility functions (cn helper)
└── public/
    └── images/                 # Generated travel images
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel will auto-detect Next.js and deploy

Or use the Vercel CLI:

```bash
npx vercel
```

### Build for Production

```bash
pnpm build
pnpm start
```

The production server will start at [http://localhost:3000](http://localhost:3000).

---

## Notes

- This project currently uses **in-memory static data** (`lib/data.ts` and `lib/admin-data.ts`) for demonstration purposes. To make it production-ready, connect a database (Supabase, Neon, etc.) and add authentication.
- The admin dashboard is accessible without authentication. Add auth middleware for production use.
- All travel images are AI-generated and stored in `/public/images/`.
