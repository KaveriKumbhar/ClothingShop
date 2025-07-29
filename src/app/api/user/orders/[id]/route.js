import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";
import { getUserFromToken } from "../../../../../../lib/auth";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(req.cookies);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await Order.findOne({ 
      orderNumber: params.id, 
      userId: userData.id 
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(req.cookies);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();
    
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Users can only cancel their orders, not change to other statuses
    if (status !== 'cancelled') {
      return NextResponse.json({ error: "Users can only cancel orders" }, { status: 400 });
    }

    const order = await Order.findOneAndUpdate(
      { orderNumber: params.id, userId: userData.id },
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order PUT error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 