import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware - Path:', pathname);
  
  // Check if the path requires authentication
  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/user');
  
  if (!isAdminRoute && !isUserRoute) {
    console.log('Middleware - No auth required for path:', pathname);
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  console.log('Middleware - Token found:', !!token);
  
  if (!token) {
    console.log('Middleware - No token, redirecting to login');
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Verify JWT token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_key')
    );
    
    console.log('Middleware - Token verified, role:', payload.role);
    
    const userRole = payload.role;
    
    // Check role-based access
    if (isAdminRoute && userRole !== 'admin') {
      console.log('Middleware - Non-admin trying to access admin route, redirecting to user');
      // Redirect non-admin users trying to access admin routes
      return NextResponse.redirect(new URL('/user', request.url));
    }
    
    if (isUserRoute && userRole !== 'user') {
      console.log('Middleware - Admin trying to access user route, redirecting to admin');
      // Redirect admin users trying to access user routes
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    console.log('Middleware - Access granted');
    return NextResponse.next();
  } catch (error) {
    console.log('Middleware - Token verification failed:', error.message);
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*']
}; 