# Merch KE Frontend

Tech swag marketplace for Kenya - built with Next.js 14, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Merch KE API running (default: http://localhost:8080)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

### Development (`.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (`.env.production`)
```env
NEXT_PUBLIC_API_BASE_URL=https://merch-ke-api-779644650318.us-central1.run.app
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

## Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utilities and API client
│   ├── api/              # API client and endpoints
│   └── utils.ts          # Helper functions
├── types/                # TypeScript types
└── public/               # Static assets
```

## API Integration

The frontend communicates with the Merch KE API. All API calls are handled through:
- `lib/api/client.ts` - Axios client with interceptors
- `lib/api/endpoints.ts` - API endpoint functions

### Features
- Automatic JWT token injection
- Guest session ID management
- Cart migration after login
- Error handling and redirects

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## License

Private - Merch KE
