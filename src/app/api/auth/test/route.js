import { NextResponse } from "next/server";
import { jwtVerify } from 'jose';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }
  
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_key')
    );
    
    return NextResponse.json({ 
      success: true, 
      payload,
      jwtSecret: process.env.JWT_SECRET ? "Set" : "Not set"
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Token verification failed", 
      details: error.message,
      jwtSecret: process.env.JWT_SECRET ? "Set" : "Not set"
    }, { status: 401 });
  }
} 