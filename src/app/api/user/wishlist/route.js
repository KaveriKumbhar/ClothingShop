import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import Product from "../../../../../models/product";
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

export async function GET(req) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(req);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userData.id).populate('wishlist');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.wishlist);
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  const userData = await getUserFromToken(req);
  if (!userData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();
  
  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const user = await User.findById(userData.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if product is already in wishlist
  if (user.wishlist.includes(productId)) {
    return NextResponse.json({ error: "Product already in wishlist" }, { status: 400 });
  }

  user.wishlist.push(productId);
  await user.save();

  return NextResponse.json({ success: true, message: "Product added to wishlist" }, { status: 201 });
}

export async function DELETE(req) {
  await dbConnect();
  const userData = await getUserFromToken(req);
  if (!userData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');
  
  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const user = await User.findById(userData.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const productIndex = user.wishlist.indexOf(productId);
  if (productIndex === -1) {
    return NextResponse.json({ error: "Product not in wishlist" }, { status: 404 });
  }

  user.wishlist.splice(productIndex, 1);
  await user.save();

  return NextResponse.json({ success: true, message: "Product removed from wishlist" });
} 