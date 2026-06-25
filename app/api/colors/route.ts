import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET /api/colors
export async function GET() {
  try {
    const { data: colors, error } = await supabase
      .from('colors')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(colors || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// POST /api/colors
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
    }

    if (id) {
      // Update
      const { data, error } = await supabase
        .from('colors')
        .update({ name, slug })
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
        .from('colors')
        .insert([{ name, slug }])
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

// DELETE /api/colors
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Color ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('colors')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Color deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
