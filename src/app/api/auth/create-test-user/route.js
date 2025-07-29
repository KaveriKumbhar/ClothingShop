import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function POST(req) {
  try {
    await dbConnect();
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      return NextResponse.json({ 
        message: "Test user already exists",
        user: { email: existingUser.email, role: existingUser.role }
      });
    }
    
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      firstName: 'Test',
      lastName: 'User'
    });
    
    return NextResponse.json({ 
      message: "Test user created successfully",
      user: { email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json({ error: "Failed to create test user" }, { status: 500 });
  }
} 