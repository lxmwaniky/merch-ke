# Merch KE - Tech Swags Ecommerce

A modern ecommerce platform for tech merchandise built with Next.js 14, integrated with a Go backend API.

## Features

- 🛍️ Product browsing and search
- 🛒 Shopping cart (guest and authenticated users)
- 👤 User authentication (register/login)
- 📦 Order management
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔒 Secure JWT authentication
- 📱 Mobile-friendly design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:8080` (see backend docs)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
copy .env.example .env.local
```

3. Update `.env.local` with your backend API URL (default is `http://localhost:8080`)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the site

## Project Structure

```
├── app/                    # Next.js 14 App Router pages
│   ├── auth/              # Authentication pages (login, register)
│   ├── products/          # Product listing and detail pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   └── orders/            # Order history page
├── components/            # Reusable React components
│   └── Header.tsx         # Navigation header
├── lib/                   # Utility functions
│   ├── api.ts            # API client for backend integration
│   └── auth.ts           # Authentication helpers
├── types/                 # TypeScript type definitions
│   └── index.ts          # Product, Cart, Order, User types
└── docs/                  # Backend API documentation
    └── API_DOC.md        # Complete API reference
```

## Tech Stack

- **Frontend Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **API Integration:** Fetch API with custom client
- **Authentication:** JWT tokens with localStorage

## Backend Integration

The frontend integrates with the Go backend API documented in `docs/API_DOC.md`. Key endpoints:

- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`
- **Products:** `/api/products`, `/api/products/:id`, `/api/products/:id/images`
- **Categories:** `/api/categories`
- **Cart:** `/api/cart` (supports guest and authenticated users)
- **Orders:** `/api/orders`

## User Flow

1. **Browse Products:** View all available tech swags
2. **Add to Cart:** Add items as guest or logged-in user
3. **Register/Login:** Create account or sign in
4. **Checkout:** Enter shipping details and place order
5. **Track Orders:** View order history and status

## Development Notes

- Guest cart uses session ID stored in localStorage
- Authenticated users get JWT token stored in localStorage
- Cart automatically migrates when guest user logs in
- All API calls include proper error handling
- Images support multiple views (front, back, detail)

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Building for Production

```bash
npm run build
npm start
```

## License

Private - Merch KE
