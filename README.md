# SNT Supermart

A full-stack online supermarket built to handle a catalog of **70,000+ products**. Customers browse, search, filter and order groceries for delivery. Store staff manage products, orders, inventory, delivery and payments from an admin dashboard.


---

## Features

### Storefront
- Home, All products, All categories, Category and Product pages
- Fast search with suggestions, plus filters (brand, price, rating, availability), sorting and pagination
- Cart, checkout and delivery slot selection
- Payments: **Cash on delivery**, **Easypaisa**, **JazzCash** and card (through a payment aggregator)
- Order tracking, including guest tracking by order number and phone
- OTP (phone) sign in, wishlist, saved addresses, reorder and notifications
- Light and dark themes, English and Urdu (RTL) support
- Responsive layout, designed mobile first

### Admin
- Dashboard with revenue, orders, rider activity and stock alerts
- Products (bulk CSV import and export), categories, inventory and suppliers
- Orders with status, rider assignment, SLA and invoice printing
- Customers and segments, payments and COD reconciliation, refunds and returns
- Delivery zones, slots and riders, coupons and banners, reports
- Staff roles and permissions, audit log, settings

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS v4, React Router |
| Server state | TanStack Query |
| Client state | Zustand |
| Forms | React Hook Form, Zod |
| Icons | react-icons |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT with refresh tokens, phone OTP |
| Storage | Object storage for images (S3 or Cloudinary) |

---

## Project structure

```
snt-supermart/
├── client/                  # React + TypeScript app
│   ├── src/
│   │   ├── app/             # router, providers, theme
│   │   ├── components/      # ui kit, layout, product, cart
│   │   ├── features/        # catalog, cart, checkout, account, admin
│   │   ├── hooks/
│   │   ├── lib/             # api client, utils
│   │   ├── pages/
│   │   ├── store/           # Zustand stores
│   │   ├── types/
│   │   └── index.css        # Tailwind theme (light and dark tokens)
│   └── package.json
├── server/                  # Express API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/
│   │   ├── services/        # payments, search, notifications
│   │   ├── utils/
│   │   └── server.ts
│   └── package.json
├── .gitignore
└── README.md
```

---

## Getting started

### Prerequisites
- Node.js 20 or newer
- MongoDB 7 (local or Atlas)
- npm, pnpm or yarn

### 1. Clone and install

```bash
git clone [YOUR_REPO_URL] snt-supermart
cd snt-supermart

cd client && npm install
cd ../server && npm install
```

### 2. Environment variables

Copy the example files and fill in the values.

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**server/.env**

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/snt-supermart
JWT_SECRET=[LONG_RANDOM_STRING]
JWT_REFRESH_SECRET=[LONG_RANDOM_STRING]
CLIENT_URL=http://localhost:5173

# Images
CLOUDINARY_URL=[YOUR_CLOUDINARY_URL]

# Payments (use sandbox keys while developing)
EASYPAISA_STORE_ID=[...]
EASYPAISA_SECRET=[...]
JAZZCASH_MERCHANT_ID=[...]
JAZZCASH_PASSWORD=[...]
JAZZCASH_INTEGRITY_SALT=[...]

# SMS (OTP)
SMS_API_KEY=[...]
```

**client/.env**

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run in development

```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd client && npm run dev
```

The app runs at `http://localhost:5173` and the API at `http://localhost:5000`.

### 4. Seed sample data (optional)

```bash
cd server && npm run seed
```

---

## Scripts

| Command | Where | What it does |
|---------|-------|--------------|
| `npm run dev` | client, server | Start the dev server |
| `npm run build` | client, server | Production build |
| `npm run preview` | client | Preview the production build |
| `npm run lint` | client, server | Run ESLint |
| `npm run typecheck` | client, server | Run the TypeScript compiler |
| `npm run seed` | server | Insert sample products and categories |

---

## Built for scale (70k+ products)

- **Server-side everything:** pagination, filtering and sorting run in MongoDB, never in the browser. A list request returns one page of products, not the catalog.
- **Cursor pagination** for deep lists, and page numbers for the catalog UI.
- **Indexes** on category, brand, price, stock, slug and a text index for search. Move to Atlas Search or Meilisearch when you need typo tolerance and faster suggestions.
- **Cached facets:** category and brand counts change rarely, so they are cached.
- **TanStack Query:** caching, request de-duplication, keep-previous-data while paging, and prefetch on hover.
- **URL as state:** filters, sort and page live in the query string, so pages are shareable and the back button works.
- **Debounced search** with a request cancel on new input.
- **Images:** WebP, fixed width and height, lazy loading and CDN thumbnails. Only URLs are stored in MongoDB.
- **Admin tables** use server-side paging and virtualised rows.
- **Code splitting:** the admin app loads as its own chunk.

---

## API overview

Base URL: `/api`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/home` | Home page data |
| GET | `/products` | Catalog with `q`, `cursor`, `sort` and filters |
| GET | `/products/:slug` | Product detail |
| GET | `/categories` | All categories with counts |
| GET | `/categories/:slug/products` | Products in one category |
| GET | `/search/suggest?q=` | Search suggestions |
| PUT | `/cart` | Save the cart |
| POST | `/orders` | Place an order |
| POST | `/orders/track` | Guest order tracking |
| GET | `/payments/:id` | Payment status |
| GET | `/me/*` | Account: profile, orders, addresses, wishlist |
| GET | `/admin/*` | Admin resources (role protected) |

---

## Design system

- **Font:** Plus Jakarta Sans (with Urdu and Arabic fallbacks)
- **Themes:** light default, dark via `class="dark"` on `<html>`
- **Tokens:** defined as CSS variables in `client/src/index.css` and mapped to Tailwind classes such as `bg-surface`, `text-muted-foreground` and `bg-primary`
- **Components:** buttons, inputs, cards, badges, chips, skeleton loaders and tables are available as ready classes (`btn btn-primary`, `card`, `badge`)

---

## Roadmap

- [ ] Catalog: Home, All products, Categories, Product
- [ ] Cart and checkout with COD
- [ ] OTP sign in and account area
- [ ] Easypaisa, JazzCash and card payments
- [ ] Admin: products, orders, dashboard
- [ ] Inventory, delivery zones and rider app
- [ ] Coupons, banners and reports
- [ ] Dark theme across all pages
- [ ] Mobile polish and PWA
- [ ] Tests (unit, API and end-to-end)

---

## Contributing

1. Create a branch: `git checkout -b feature/[name]`
2. Commit with clear messages
3. Run `npm run lint` and `npm run typecheck` before opening a pull request

---

## License

[CHOOSE A LICENSE, for example MIT]

---

## Contact

Built by **Sahil Ali** · sahil.bhutto.dev@gmail.com
