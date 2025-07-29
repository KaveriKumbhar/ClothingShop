import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import { getUserFromToken } from "../../../../../lib/auth";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(cookies());
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userData.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect();
  const userData = await getUserFromToken(cookies());
  if (!userData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { firstName, lastName, phone } = await req.json();
  
  const user = await User.findByIdAndUpdate(
    userData.id,
    { firstName, lastName, phone },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
} 