import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import { SignJWT } from 'jose';

export async function POST(req) {
  console.log('DEBUG LOGIN - Starting...');
  const { email, password } = await req.json();
  
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  
  try {
    await dbConnect();
    console.log('DEBUG LOGIN - Database connected');
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('DEBUG LOGIN - User not found');
      return NextResponse.json({ error: "User not found." }, { status: 400 });
    }
    
    console.log('DEBUG LOGIN - User found:', { email: user.email, role: user.role });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('DEBUG LOGIN - Password mismatch');
      return NextResponse.json({ error: "Invalid password." }, { status: 400 });
    }
    
    console.log('DEBUG LOGIN - Password verified');
    
    // Issue JWT
    const token = await new SignJWT({ id: user._id.toString(), email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_key'));
    
    console.log('DEBUG LOGIN - Token created');
    
    // Create response with token in body
    const response = NextResponse.json({ 
      success: true, 
      user: { id: user._id.toString(), email: user.email, role: user.role },
      token: token // Include token in response for debugging
    });
    
    // Set token as HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
    
    console.log('DEBUG LOGIN - Cookie set');
    
    return response;
  } catch (error) {
    console.error('DEBUG LOGIN - Error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 