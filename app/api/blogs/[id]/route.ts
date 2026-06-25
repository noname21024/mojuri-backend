import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      const response = NextResponse.json(
        { error: 'Blog post identifier is required' },
        { status: 400 }
      );
      return corsResponse(response);
    }

    // Check if the identifier is a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

    let query = supabase
      .from('blog_posts')
      .select('*, blog_categories(*), users(*)');

    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { data: post, error } = await query.maybeSingle();

    if (error) {
      console.error('Supabase query error:', error);
      const response = NextResponse.json(
        { error: 'Database query error: ' + error.message },
        { status: 500 }
      );
      return corsResponse(response);
    }

    if (!post) {
      const response = NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
      return corsResponse(response);
    }

    const response = NextResponse.json({
      success: true,
      data: post,
    });

    return corsResponse(response);
  } catch (error: any) {
    console.error('Single blog API error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
    return corsResponse(response);
  }
}
