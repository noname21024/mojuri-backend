import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// Helper to set CORS headers
function corsResponse(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

function formatDate(isoString: string | null) {
  if (!isoString) return undefined;
  try {
    const date = new Date(isoString);
    const YYYY = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const DD = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${YYYY}-${MM}-${DD} ${hh}:${mm}`;
  } catch (e) {
    return isoString;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return corsResponse(response);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      const response = NextResponse.json(
        { error: 'Contact identifier is required' },
        { status: 400 }
      );
      return corsResponse(response);
    }

    const body = await request.json();
    const updateData: any = {};

    // Map frontend fields to DB columns
    if (body.status !== undefined) {
      const statusLower = typeof body.status === 'string' ? body.status.toLowerCase() : '';
      if (statusLower === 'read' || statusLower === 'unread') {
        updateData.status = statusLower;
      }
    }
    
    if (body.replyContent !== undefined) {
      updateData.reply_content = body.replyContent;
    }
    
    if (body.repliedAt !== undefined) {
      updateData.replied_at = body.repliedAt;
    }

    updateData.updated_at = new Date().toISOString();

    const { data: updatedContact, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      const response = NextResponse.json(
        { error: 'Database update error: ' + error.message },
        { status: 500 }
      );
      return corsResponse(response);
    }

    // Map back to frontend shape
    const formattedContact = {
      id: updatedContact.id,
      name: updatedContact.name,
      email: updatedContact.email,
      subject: updatedContact.title,
      message: updatedContact.message,
      status: updatedContact.status === 'read' ? 'Read' : 'Unread',
      replyContent: updatedContact.reply_content,
      repliedAt: formatDate(updatedContact.replied_at),
      createdAt: formatDate(updatedContact.created_at),
    };

    const response = NextResponse.json({
      success: true,
      data: formattedContact,
    });
    return corsResponse(response);
  } catch (error: any) {
    console.error('Single contact PATCH API error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
    return corsResponse(response);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      const response = NextResponse.json(
        { error: 'Contact identifier is required' },
        { status: 400 }
      );
      return corsResponse(response);
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      const response = NextResponse.json(
        { error: 'Database delete error: ' + error.message },
        { status: 500 }
      );
      return corsResponse(response);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
    return corsResponse(response);
  } catch (error: any) {
    console.error('Single contact DELETE API error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
    return corsResponse(response);
  }
}
