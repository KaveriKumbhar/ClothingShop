import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import Wishlist from "../../../../models/Wishlist";
import { getUserFromToken } from "../../../../lib/auth";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(cookies());
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let wishlist = await Wishlist.findOne({ userId: userData.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: userData.id, items: [] });
    }

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(cookies());
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Get product details
    const Product = (await import("../../../../models/product")).default;
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let wishlist = await Wishlist.findOne({ userId: userData.id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: userData.id, items: [] });
    }

    // Check if product already exists in wishlist
    const existingItem = wishlist.items.find(
      item => item.product._id.toString() === productId
    );

    if (existingItem) {
      return NextResponse.json({ error: "Product already in wishlist" }, { status: 400 });
    }

    // Add new item
    wishlist.items.push({
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug
      }
    });

    await wishlist.save();
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(cookies());
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ userId: userData.id });
    if (!wishlist) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });
    }

    wishlist.items = wishlist.items.filter(
      item => item.product._id.toString() !== productId
    );

    await wishlist.save();
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 