import dotenv from 'dotenv';
dotenv.config();

import { dbConnect } from '../lib/mongodb.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@clothing.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      email: 'admin@clothing.com',
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    });

    console.log('Admin user created successfully:', {
      email: adminUser.email,
      role: adminUser.role,
      id: adminUser._id
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin(); 