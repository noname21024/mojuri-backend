import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET /api/reviews
export async function GET() {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*, products(name, thumbnail)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(reviews || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// POST /api/reviews
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, product_id, user_id, reviewer_name, reviewer_email, rating, content } = body;

    if (!product_id || !reviewer_name || !rating) {
      return NextResponse.json({ message: 'Product ID, reviewer name, and rating are required' }, { status: 400 });
    }

    const reviewData = {
      product_id,
      user_id: user_id || null,
      reviewer_name,
      reviewer_email: reviewer_email || null,
      rating: parseInt(rating),
      content: content || null
    };

    if (id) {
      // Update
      const { data, error } = await supabase
        .from('reviews')
        .update(reviewData)
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
        .from('reviews')
        .insert([reviewData])
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

// DELETE /api/reviews
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Review ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
