import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";
import { getUserFromToken } from "../../../../../../lib/auth";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    // Check if user is authenticated and is admin
    const user = await getUserFromToken(req.cookies);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const { id: orderNumber } = params;
    const { status } = await req.json();

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Find and update the order by orderNumber
    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
} 