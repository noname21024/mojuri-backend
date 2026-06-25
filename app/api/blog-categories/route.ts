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

export async function GET() {
  try {
    // Select all categories and count related published blog posts
    // In Supabase/PostgREST, we can count children using join syntax or simple selects
    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('*, blog_posts(count)')
      .eq('blog_posts.status', 'published');

    if (error) {
      console.error('Supabase blog categories query error:', error);
      
      // Fallback: just return categories without counts if sub-query count fails
      const { data: fallbackCats, error: fallbackError } = await supabase
        .from('blog_categories')
        .select('*');
        
      if (fallbackError) {
        const response = NextResponse.json(
          { error: 'Database query error: ' + fallbackError.message },
          { status: 500 }
        );
        return corsResponse(response);
      }
      
      const response = NextResponse.json({
        success: true,
        data: fallbackCats?.map(c => ({ ...c, post_count: 0 })) || [],
      });
      return corsResponse(response);
    }

    // Process categories to count the number of published posts
    const formattedCategories = (categories || []).map((cat: any) => {
      // blog_posts count will return [{ count: X }] or count value depending on PostgREST
      const postCount = cat.blog_posts?.[0]?.count || cat.blog_posts?.count || 0;
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        created_at: cat.created_at,
        post_count: postCount
      };
    });

    const response = NextResponse.json({
      success: true,
      data: formattedCategories,
    });

    return corsResponse(response);
  } catch (error: any) {
    console.error('Blog categories API error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
    return corsResponse(response);
  }
}
