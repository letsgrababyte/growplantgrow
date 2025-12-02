# Admin Sign-In Setup Guide

## Overview

The admin system now has a **dedicated admin sign-in page** that's separate from regular user sign-in. When you sign in as an admin, you'll see the normal site with an **admin bar** at the bottom that gives you quick access to admin features.

## Features

### 1. Dedicated Admin Sign-In (`/admin/signin`)
- Separate from regular user sign-in
- Only users in the `admin_users` table can sign in
- Validates admin status before allowing access
- Beautiful admin-themed design

### 2. Admin Bar on Normal Site
- Appears at the bottom of the page when you're signed in as admin
- Shows "Admin Mode" indicator with your role
- Quick links to:
  - Dashboard
  - Products
  - + New Product
  - Orders
  - Analytics
- Can be hidden/shown with a toggle
- Only shows on normal site pages (not on `/admin/*` pages which have their own sidebar)

### 3. Admin Dashboard (`/admin`)
- Full admin interface with sidebar
- Accessible only to admins
- Redirects to `/admin/signin` if not authenticated

## Setup Instructions

### Step 1: Create Your Admin Account

1. **Sign up or sign in** to your regular account first (use `/signup` or `/signin`)
2. **Get your user ID** from Supabase Dashboard:
   - Go to Authentication > Users
   - Find your user and copy the UUID

3. **Add yourself as admin** in Supabase SQL Editor:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
INSERT INTO admin_users (user_id, role, permissions)
VALUES (
  'YOUR_USER_ID',
  'super_admin',
  '{"all": true}'::jsonb
);
```

**OR** use this query to make the most recent user an admin:

```sql
INSERT INTO admin_users (user_id, role, permissions)
SELECT 
  id,
  'super_admin',
  '{"all": true}'::jsonb
FROM auth.users
WHERE email = 'your-email@example.com';
```

### Step 2: Sign In to Admin Portal

1. Go to: `http://localhost:3000/admin/signin`
2. Enter your admin email and password
3. You'll be redirected to `/admin` dashboard

### Step 3: Use Admin Features

#### On Normal Site (with Admin Bar)
- Browse the site normally
- Admin bar appears at bottom
- Click links to access admin features
- Toggle admin bar visibility

#### On Admin Dashboard (`/admin`)
- Full admin interface
- Sidebar navigation
- All admin features

## Admin Roles

- **super_admin**: Full access to everything
- **admin**: Manage products, orders, customers
- **editor**: Create/edit products, view analytics
- **support**: Access customer service tools
- **viewer**: Read-only access to analytics

## Security

- Admin sign-in validates against `admin_users` table
- Non-admin users cannot access admin portal
- Regular sign-in won't give admin access
- Admin status is checked on every admin route

## Troubleshooting

### "Access denied" when signing in
- Make sure your user ID exists in `admin_users` table
- Check that your role is set correctly
- Verify you're using the correct email/password

### Admin bar not showing
- Make sure you signed in via `/admin/signin` (not regular sign-in)
- Check that your user is in `admin_users` table
- Admin bar only shows on normal site pages (not `/admin/*`)

### Can't access `/admin`
- You'll be redirected to `/admin/signin` if not authenticated
- Make sure you signed in through the admin portal
- Verify your admin status in the database

## Next Steps

1. ✅ Set up your admin account
2. ✅ Sign in at `/admin/signin`
3. ✅ Explore admin features
4. ✅ Use admin bar on normal site for quick access

---

**Note**: The admin sign-in is completely separate from regular user sign-in. Regular users cannot access admin features even if they sign in through the normal sign-in page.

