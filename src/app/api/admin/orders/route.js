import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/mongodb";
import Order from "../../../../../models/Order";
import { getUserFromToken } from "../../../../../lib/auth";

export async function GET(req) {
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

    // Fetch all orders with user details
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
} 