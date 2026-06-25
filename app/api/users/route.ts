import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET /api/users
export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(users || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// POST /api/users
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, password, full_name, role } = body;

    if (!email || (!id && !password)) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const userData: any = {
      email,
      full_name: full_name || null,
      role: role || 'user'
    };

    // Only set password if provided (important for updates where password shouldn't be overridden if blank)
    if (password) {
      userData.password = password;
    }

    if (id) {
      // Update
      const { data, error } = await supabase
        .from('users')
        .update({
          ...userData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('id, email, full_name, role, created_at, updated_at')
        .single();

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(data, { status: 200 });
    } else {
      // Create
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select('id, email, full_name, role, created_at, updated_at')
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

// DELETE /api/users
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
