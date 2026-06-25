import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

function corsResponse(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return corsResponse(response);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('s');

    let query = supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Filter by search query in title or summary
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    // Filter by category if slug is provided
    if (categorySlug) {
      const { data: categoryData } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    // Apply limit if specified
    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit)) {
        query = query.limit(parsedLimit);
      }
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('Supabase blog posts query error:', error);
      const response = NextResponse.json(
        { error: 'Database query error: ' + error.message },
        { status: 500 }
      );
      return corsResponse(response);
    }

    const response = NextResponse.json({
      success: true,
      data: posts || [],
    });

    return corsResponse(response);
  } catch (error: any) {
    console.error('Blogs API error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
    return corsResponse(response);
  }
}
