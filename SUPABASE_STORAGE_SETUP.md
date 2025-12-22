# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for product image uploads in the admin panel.

## Prerequisites

- A Supabase project (create one at https://supabase.com)
- Admin access to your Supabase project dashboard

## Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **Enable** (so images can be accessed via public URLs)
   - **File size limit**: 5 MB (or your preferred limit)
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp, image/gif`

5. Click **Create bucket**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies to control who can upload and read images.

### Policy 1: Allow Public Read Access

1. Go to **Storage** → **Policies** → Select `product-images` bucket
2. Click **New Policy**
3. Choose **For full customization**, then click **Use this template**
4. Configure:
   - **Policy name**: `Public read access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**:
   ```sql
   (bucket_id = 'product-images')
   ```
   - **Policy command**: `SELECT`
   - **Target roles**: `public` (or `anon`)

5. Click **Review** and then **Save policy**

### Policy 2: Allow Authenticated Users to Upload

1. Click **New Policy** again
2. Choose **For full customization**
3. Configure:
   - **Policy name**: `Authenticated upload`
   - **Allowed operation**: `INSERT`
   - **Policy definition**:
   ```sql
   (bucket_id = 'product-images' AND auth.role() = 'authenticated')
   ```
   - **Policy command**: `INSERT`
   - **Target roles**: `authenticated`

4. Click **Review** and then **Save policy**

### Policy 3: Allow Authenticated Users to Update/Delete (Optional)

If you want admins to be able to update or delete images:

1. Click **New Policy** again
2. Configure:
   - **Policy name**: `Authenticated update/delete`
   - **Allowed operation**: `UPDATE` and `DELETE`
   - **Policy definition**:
   ```sql
   (bucket_id = 'product-images' AND auth.role() = 'authenticated')
   ```
   - **Policy command**: `UPDATE, DELETE`
   - **Target roles**: `authenticated`

3. Click **Review** and then **Save policy**

## Step 3: Alternative - Using Service Role Key (Recommended for Admin)

For admin operations, you can use the service role key which bypasses RLS. This is already implemented in the upload route (`/api/admin/upload/route.ts`).

**⚠️ Security Note**: The service role key should NEVER be exposed to the client. It's only used in server-side API routes.

## Step 4: Test the Upload

1. Make sure your `.env.local` file has the correct Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Start your development server:
   ```bash
   npm run dev
   ```

3. Navigate to `/admin/products/new` (you'll need to be logged in as an admin)

4. Try uploading an image using the "Upload Image" button

5. Check your Supabase Storage dashboard to verify the image was uploaded

## Troubleshooting

### Error: "new row violates row-level security policy"

**Solution**: Make sure you've set up the storage policies as described above, or ensure your API route is using the service role key.

### Error: "Bucket not found"

**Solution**: 
- Verify the bucket name is exactly `product-images`
- Check that the bucket exists in your Supabase Storage dashboard

### Images not displaying

**Solution**:
- Ensure the bucket is set to **Public**
- Check that the public URL is being generated correctly
- Verify CORS settings if accessing from a different domain

### Upload fails with 401 Unauthorized

**Solution**:
- Verify your Supabase credentials in `.env.local`
- Check that you're authenticated as an admin user
- Ensure the admin authentication is working correctly

## Folder Structure

The upload route organizes images in folders:
- `thumbnails/` - Product thumbnail images
- `previews/` - Product preview images (future feature)
- `products/` - General product images

You can customize the folder structure by modifying the `folder` parameter in the upload API route.

## File Naming

Uploaded files are automatically renamed with a timestamp and random string to prevent conflicts:
- Format: `{timestamp}-{randomString}.{extension}`
- Example: `1703123456789-abc123def456.jpg`

## Next Steps

- Set up image optimization (consider using Cloudflare Images or Next.js Image Optimization)
- Implement image deletion when products are removed
- Add image cropping/resizing before upload
- Set up CDN for faster image delivery


