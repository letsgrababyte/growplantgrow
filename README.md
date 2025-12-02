# GrowPlantGrow

A Next.js e-commerce site for botanical digital printables and ebooks, connected to the Etsy ecosystem.

## Features

- 🛍️ Product catalog with category and search filters
- 🎨 Beautiful botanical green/cream theme
- 📱 Fully responsive design
- 🔍 Advanced search functionality
- 🛒 Integration-ready for Lemon Squeezy, Etsy, Printify, and Stripe
- ⚡ Built with Next.js 14 App Router, TypeScript, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── data/
│   └── products.json          # Product data
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── shop/             # Shop pages
│   │   ├── about/            # About page
│   │   ├── faq/              # FAQ page
│   │   └── contact/           # Contact page
│   ├── components/           # Reusable components
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFeed.tsx
│   │   └── SectionHeading.tsx
│   └── lib/
│       └── products.ts        # Product helper functions
└── package.json
```

## Pages

- `/` - Home page with hero and featured products
- `/shop` - Product grid with category and search filters
- `/shop/[slug]` - Individual product pages
- `/about` - About page
- `/faq` - Frequently asked questions
- `/contact` - Contact form

## Customization

### Adding Products

Edit `data/products.json` to add or modify products. Each product should include:
- `id`, `title`, `slug`, `price`, `category`
- `description`, `tags`, `thumbnailUrl`, `previewImages`
- `fileType`, `pageCount`, `isFeatured`, `lemonSqueezyUrl`

### Styling

The botanical theme uses custom Tailwind colors defined in `tailwind.config.ts`:
- `botanical-green-*` - Green color palette
- `botanical-cream-*` - Cream color palette

### Integration

The codebase is designed to be easily extended for:
- **Lemon Squeezy**: Update `lemonSqueezyUrl` in product data
- **Etsy**: Add Etsy API integration in product helpers
- **Printify**: Add Printify webhook handlers
- **Stripe**: Add Stripe checkout components

## Build

```bash
npm run build
npm start
```

## License

Apache-2.0