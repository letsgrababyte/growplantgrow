import { createClient } from '@/lib/supabase/client';
import { Product } from './products';

export interface OrderItem {
  product_id: string;
  product_title: string;
  product_price: number;
  quantity: number;
}

export interface CreateOrderData {
  items: OrderItem[];
  total_amount: number;
  payment_provider?: string;
  payment_id?: string;
}

/**
 * Create a new order in Supabase
 */
export async function createOrder(data: CreateOrderData): Promise<string | null> {
  const supabase = createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be logged in to create an order');
    }

    // Generate order number
    const orderNumber = `GPG-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        total_amount: data.total_amount,
        status: 'completed',
        payment_provider: data.payment_provider || 'lemon_squeezy',
        payment_id: data.payment_id,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }

    // Create order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_title: item.product_title,
      product_price: item.product_price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return null;
    }

    return order.id;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

/**
 * Get orders for the current user
 */
export async function getUserOrders() {
  const supabase = createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading orders:', error);
      return [];
    }

    return orders || [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

/**
 * Get order items for a specific order
 */
export async function getOrderItems(orderId: string) {
  const supabase = createClient();
  
  try {
    const { data: items, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading order items:', error);
      return [];
    }

    return items || [];
  } catch (error) {
    console.error('Error loading order items:', error);
    return [];
  }
}

