import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as z from 'zod';
import { supabase } from '../../../../lib/supabase';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

const JWT_SECRET = process.env.JWT_SECRET || 'mojuri_super_secret_auth_key_2026_encryption_signature';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Fetch user from Supabase
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, email, password, full_name, role')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json(
        { message: 'Lỗi truy vấn Supabase: ' + fetchError.message },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // Check password (support both plain text and bcrypt hash for compatibility)
    let isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      try {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } catch (err) {
        // Not a bcrypt hash
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // Sign JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json(
      {
        message: 'Đăng nhập thành công',
        token,
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
    console.error('Login API Error:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra trên máy chủ: ' + error.message },
      { status: 500 }
    );
  }
}
