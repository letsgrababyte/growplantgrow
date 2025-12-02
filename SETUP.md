# Setup Instructions

## Environment Variables

**IMPORTANT:** The app will work without Supabase, but authentication features will be disabled.

To enable authentication:

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting Supabase Credentials

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > API
4. Copy the "Project URL" and "anon public" key
5. Paste them into your `.env.local` file

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file with your Supabase credentials (see above)

3. Start the development server:
```bash
npm run dev
```

## Features Implemented

✅ Supabase Authentication (Sign In/Sign Up)
✅ Shopping Cart with localStorage persistence
✅ Favorites/Wishlist functionality
✅ Product Scroller on homepage
✅ Hamburger menu for mobile
✅ Social media links (Pinterest, Instagram, Facebook, YouTube)
✅ Etsy store button
✅ Account page
✅ Cart page
✅ Checkout page
✅ Terms, Policies, Return Policy, and Learn pages

## Troubleshooting

### Build Error: Module not found '@supabase/ssr'
- Make sure you've run `npm install`
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- Restart your dev server

### Authentication not working
- Make sure your `.env.local` file has the correct Supabase credentials
- Check that your Supabase project is active
- Verify the environment variables are loaded (restart dev server after adding them)

