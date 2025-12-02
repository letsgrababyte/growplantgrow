import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth';
import { updateProduct, deleteProduct } from '@/lib/admin/products';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(['super_admin', 'admin', 'editor']);
    
    const params = await context.params;
    const body = await request.json();
    const product = await updateProduct(params.id, body);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Failed to update product' },
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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(['super_admin', 'admin', 'editor']);
    
    const params = await context.params;
    const success = await deleteProduct(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

