import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET /api/contacts - Fetch all contact messages (Admin)
export async function GET() {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(contacts || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// POST /api/contacts - Submit a new contact message (User contact form)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, title, message } = body;

    if (!name || !email || !title || !message) {
      return NextResponse.json({ message: 'Missing required contact fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          title,
          message,
          status: 'unread'
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// PATCH /api/contacts - Update contact status or simulate reply (Admin)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { contactId, status } = body;

    if (!contactId || !status) {
      return NextResponse.json({ message: 'Contact ID and status are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('contacts')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', contactId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
