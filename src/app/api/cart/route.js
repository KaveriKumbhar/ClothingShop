import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import Cart from "../../../../models/Cart";
import { getUserFromToken } from "../../../../lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(req.cookies);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let cart = await Cart.findOne({ userId: userData.id });
    if (!cart) {
      cart = await Cart.create({ userId: userData.id, items: [] });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(req.cookies);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Get product details
    const Product = (await import("../../../../models/product")).default;
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let cart = await Cart.findOne({ userId: userData.id });
    if (!cart) {
      cart = new Cart({ userId: userData.id, items: [] });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product._id.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          slug: product.slug
        },
        quantity
      });
    }

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(req.cookies);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();
    
    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId: userData.id });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product._id.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Product not found in cart" }, { status: 404 });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Cart PUT error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(req.cookies);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId: userData.id });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter(
      item => item.product._id.toString() !== productId
    );

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 