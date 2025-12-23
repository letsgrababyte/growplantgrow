import CategoryPageClient from '@/components/CategoryPageClient';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// All valid categories (from CategoryScroller)
const validCategories = [
  'Planners',
  'Journals',
  'Coloring Pages',
  'Wall Art',
  'Botanical Papers',
  'Garden Planners',
  'Wedding',
  'Kids & School',
  'Home Organizing',
  'Labels & Stickers',
  'Recipe Cards',
  'Business Templates',
  'Branding Kits',
  'Canva Templates',
  'Digital Notebooks',
  'GoodNotes Planners',
  'Activity Packs',
  'Ebooks',
  'Guides & Workbooks',
  'Bundles',
  'Mega Packs',
  'Seasonal',
  'Holiday',
  'Mindfulness',
  'Manifestation',
  'Moon Journals',
  'Classroom Posters',
  'Kids Printables',
  'Vintage Botanicals',
  'Freebies',
];

export async function generateStaticParams() {
  return validCategories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Decode the category name from URL
  const categoryName = decodeURIComponent(params.category);

  return (
    <CategoryPageClient 
      categoryName={categoryName}
      validCategories={validCategories}
    />
  );
}

