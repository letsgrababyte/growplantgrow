/**
 * Migration script to move products from data/products.json to Supabase
 * 
 * Run with: npx tsx scripts/migrate-products.ts
 */

import { createClient } from '@supabase/supabase-js';
import productsData from '../data/products.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function migrateProducts() {
  console.log('Starting product migration...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const product of productsData) {
    try {
      // Check if product already exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .single();

      if (existing) {
        console.log(`⏭️  Skipping ${product.title} (already exists)`);
        continue;
      }

      const { error } = await supabase
        .from('products')
        .insert({
          title: product.title,
          slug: product.slug,
          description: product.description,
          price: product.price,
          category: product.category,
          tags: product.tags,
          thumbnail_url: product.thumbnailUrl,
          preview_images: product.previewImages,
          file_type: product.fileType,
          page_count: product.pageCount,
          is_featured: product.isFeatured,
          lemon_squeezy_url: product.lemonSqueezyUrl,
          status: 'active', // Set all existing products to active
          published_at: new Date().toISOString(),
        });

      if (error) {
        console.error(`❌ Error migrating ${product.title}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Migrated: ${product.title}`);
        successCount++;
      }
    } catch (err: any) {
      console.error(`❌ Error migrating ${product.title}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${productsData.length}`);
}

migrateProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });

