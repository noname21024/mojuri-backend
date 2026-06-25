import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET /api/brands
export async function GET() {
  try {
    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(brands || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// POST /api/brands
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, logo } = body;

    if (!name || !slug) {
      return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
    }

    const brandData = { name, slug, logo: logo || null };

    if (id) {
      // Update
      const { data, error } = await supabase
        .from('brands')
        .update(brandData)
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
        .from('brands')
        .insert([brandData])
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

// DELETE /api/brands
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Brand ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Brand deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
