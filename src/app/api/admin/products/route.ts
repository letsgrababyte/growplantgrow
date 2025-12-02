import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth';
import { createProduct } from '@/lib/admin/products';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(['super_admin', 'admin', 'editor']);
    
    const body = await request.json();
    const product = await createProduct(body);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

