import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET /api/orders - Fetch all orders (Admin overview)
export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(orders || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// POST /api/orders - Place a new order (Checkout)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      subtotal,
      shipping_fee,
      total,
      items
    } = body;

    if (!customer_name || !customer_email || !customer_phone || !shipping_address || !items || !items.length) {
      return NextResponse.json({ message: 'Missing required order details' }, { status: 400 });
    }

    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user_id || null,
          customer_name,
          customer_email,
          customer_phone,
          shipping_address,
          subtotal,
          shipping_fee,
          total,
          status: 'pending'
        }
      ])
      .select('id')
      .single();

    if (orderError || !order) {
      return NextResponse.json({ message: 'Failed to create order: ' + orderError?.message }, { status: 500 });
    }

    // 2. Insert order items
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      // Clean up the order if items fail (optional, but good practice since no standard Transaction API in client)
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ message: 'Failed to insert order items: ' + itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ id: order.id, message: 'Order placed successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// PATCH /api/orders - Update order status (Admin)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ message: 'Order ID and status are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select('*, order_items(*, products(*))')
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
