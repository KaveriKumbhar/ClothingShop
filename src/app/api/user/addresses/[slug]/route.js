import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";
import { jwtVerify } from 'jose';

// Helper function to get user from token
async function getUserFromToken(req) {
  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_key')
    );
    return payload;
  } catch (err) {
    console.error('JWT verification error:', err);
    return null;
  }
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(req);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;
    const user = await User.findById(userData.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const address = user.addresses.find(addr => addr.slug === slug);
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json(address);
  } catch (error) {
    console.error('Address GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(req);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = params;
    const addressData = await req.json();
    
    // Validate required fields
    if (!addressData.street || !addressData.city || !addressData.state || !addressData.zipCode) {
      return NextResponse.json({ error: "Street, city, state, and zip code are required" }, { status: 400 });
    }

    const user = await User.findById(userData.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const addressIndex = user.addresses.findIndex(addr => addr.slug === slug);
    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // If this address is set as default, unset others
    if (addressData.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    // Update the address
    user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...addressData };
    await user.save();

    return NextResponse.json(user.addresses[addressIndex]);
  } catch (error) {
    console.error('Address PUT error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 