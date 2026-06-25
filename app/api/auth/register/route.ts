import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import * as z from 'zod';
import { supabase } from '../../../../lib/supabase';

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
  full_name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, full_name } = validation.data;
    const finalFullName = full_name || email.split('@')[0];

    // Check if user already exists in Supabase
    const { data: userExist, error: existError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existError) {
      return NextResponse.json(
        { message: 'Lỗi truy vấn Supabase: ' + existError.message },
        { status: 500 }
      );
    }

    if (userExist) {
      return NextResponse.json(
        { message: 'Email này đã được sử dụng' },
        { status: 400 }
      );
    }

    // Insert user into Supabase (passwords stored in plain text per request)
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        { email, password, full_name: finalFullName, role: 'user' }
      ])
      .select('id, email, full_name, role')
      .single();

    if (insertError) {
      return NextResponse.json(
        { message: 'Lỗi ghi dữ liệu Supabase: ' + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Đăng ký thành công', 
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role
        } 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra trên máy chủ: ' + error.message },
      { status: 500 }
    );
  }
}
