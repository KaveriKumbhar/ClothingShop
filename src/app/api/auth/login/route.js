import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {dbConnect} from "../../../../../lib/mongodb";
import User from "../../../../../models/User"
import { SignJWT } from 'jose';

export async function POST(req) {
  console.log('TEST_ENV:', process.env.TEST_ENV);
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 400 });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: "Invalid password." }, { status: 400 });
  }
  // Issue JWT
  const token = await new SignJWT({ id: user._id.toString(), email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_key'));
  
  // Create response with token in body
  const response = NextResponse.json({ 
    success: true, 
    user: { id: user._id.toString(), email: user.email, role: user.role } 
  });
  
  // Set token as HTTP-only cookie
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  });
  
  return response;
} 