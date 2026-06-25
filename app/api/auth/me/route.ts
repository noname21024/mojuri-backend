import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../../lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'mojuri_super_secret_auth_key_2026_encryption_signature';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Không tìm thấy token xác thực' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify JWT Token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: 'Mã xác thực không hợp lệ hoặc đã hết hạn' },
        { status: 401 }
      );
    }

    // Verify if user still exists in Supabase
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .eq('id', decoded.id)
      .maybeSingle();

    if (fetchError || !user) {
      return NextResponse.json(
        { message: 'Tài khoản không tồn tại hoặc lỗi kết nối Supabase' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Me Profile API Error:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra trên máy chủ: ' + error.message },
      { status: 500 }
    );
  }
}
