import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

interface Params {
  slug: string;
}

export async function GET(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { slug } = await context.params;

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (!post) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
