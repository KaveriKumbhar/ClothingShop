import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function POST(req) {
  try {
    await dbConnect();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Admin user already exists",
        user: { email: existingAdmin.email, role: existingAdmin.role }
      });
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    });
    
    return NextResponse.json({ 
      message: "Admin user created successfully",
      user: { email: adminUser.email, role: adminUser.role }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 });
  }
} 