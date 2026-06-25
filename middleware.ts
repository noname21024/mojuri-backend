import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || 'http://localhost:5173';
  const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
  
  const headers = new Headers();
  if (allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  } else {
    headers.set('Access-Control-Allow-Origin', '*');
  }

  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS requests immediately
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: headers
    });
  }

  // Proceed to route handler
  const response = NextResponse.next();
  
  // Apply CORS headers to the normal response
  headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
