import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET /api/products - Supports filtering & sorting
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
    const limit = searchParams.get('limit');

    let query = supabase.from('products').select('*, categories(*)');

    // Filter by Category Slug
    if (categorySlug && categorySlug !== 'all') {
      // First get the category ID
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();
      
      if (catData) {
        query = query.eq('category_id', catData.id);
      }
    }

    // Filter by price
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    // Sort options
    if (sort === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else if (sort === 'latest') {
      query = query.order('created_at', { ascending: false });
    } else {
      // Default sorting
      query = query.order('created_at', { ascending: false });
    }

    // Limit records
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: products, error } = await query;

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: products || [],
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// POST /api/products - Create or Update product (Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, ...productData } = body;

    if (id) {
      // Update
      const { data, error } = await supabase
        .from('products')
        .update({
          ...productData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(data, { status: 200 });
    } else {
      // Create
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(data, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// DELETE /api/products - Delete product (Admin)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
