# Admin Panel Setup Guide

## Step 1: Database Migration ✅

The database migration has been applied successfully! All tables are now created in Supabase.

## Step 2: Create Your Admin User

After signing up/logging in to your account, you need to add yourself as an admin user.

### Option A: Using Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Run this query (replace `'your-email@example.com'` with your actual email):

```sql
-- First, get your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then, insert yourself as a super admin (replace 'YOUR_USER_ID' with the ID from above)
INSERT INTO admin_users (user_id, role, permissions)
VALUES (
  'YOUR_USER_ID',
  'super_admin',
  '{"all": true}'::jsonb
);
```

### Option B: Using SQL Query Directly

```sql
-- This will create an admin user for the most recently created user
INSERT INTO admin_users (user_id, role, permissions)
SELECT 
  id,
  'super_admin',
  '{"all": true}'::jsonb
FROM auth.users
ORDER BY created_at DESC
LIMIT 1;
```

## Step 3: Migrate Existing Products

Run the migration script to move products from `data/products.json` to Supabase:

```bash
# Make sure you have SUPABASE_SERVICE_ROLE_KEY in your .env.local
# Then run:
npx tsx scripts/migrate-products.ts
```

**Note:** You'll need to add `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local` file. You can find this in your Supabase Dashboard under Settings > API.

## Step 4: Access the Admin Panel

1. Make sure you're signed in to your account
2. Navigate to: `http://localhost:3000/admin`
3. You should see the admin dashboard!

## Admin Roles

- **super_admin**: Full access to everything
- **admin**: Manage products, orders, customers
- **editor**: Create/edit products, view analytics
- **support**: Access customer service tools, view orders
- **viewer**: Read-only access to analytics

## Troubleshooting

### "Access Denied" or Redirect to Sign In

- Make sure you're signed in
- Verify your user ID exists in the `admin_users` table
- Check that your role is set correctly

### Products Not Showing

- Run the migration script: `npx tsx scripts/migrate-products.ts`
- Check that products exist in the `products` table in Supabase

### Can't Access Admin Routes

- Verify your user is in the `admin_users` table
- Check that RLS policies are enabled (they should be from the migration)
- Make sure you're using the correct Supabase credentials

## Next Steps

1. ✅ Database migration - DONE
2. ✅ Admin authentication - DONE
3. ✅ Admin dashboard - DONE
4. ✅ Product management - DONE
5. ⏭️ Product editor (create/edit form)
6. ⏭️ Order management
7. ⏭️ Customer management
8. ⏭️ Analytics dashboard
9. ⏭️ AI integration

