import { NextResponse } from "next/server";

export async function POST() {
  // Create response
  const response = NextResponse.json({ 
    success: true, 
    message: "Logged out successfully" 
  });
  
  // Clear the token cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0), // Expire immediately
    path: '/'
  });
  
  return response;
} 