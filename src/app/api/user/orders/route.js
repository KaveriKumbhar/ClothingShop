import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/mongodb";
import Order from "../../../../../models/Order";
import { getUserFromToken } from "../../../../../lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(req.cookies);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ userId: userData.id })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(50); // Limit to last 50 orders

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders GET error:', error);
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

    const { items, totalAmount, shippingAddress, paymentMethod } = await req.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 });
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ error: "Valid total amount is required" }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: "Payment method is required" }, { status: 400 });
    }

    const order = new Order({
      userId: userData.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 