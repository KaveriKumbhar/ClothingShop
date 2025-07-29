import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/mongodb";
import Activity from "../../../../../models/Activity";
import { getUserFromToken } from "../../../../../lib/auth";
import { cookies } from "next/headers";

export async function GET(req) {
  await dbConnect();
  const user = await getUserFromToken(cookies());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const activities = await Activity.find({ user: user.id })
    .sort({ createdAt: -1 })
    .limit(2)
    .lean();
  return NextResponse.json(activities);
}

export async function POST(req) {
  await dbConnect();
  const user = await getUserFromToken(cookies());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { type, details } = await req.json();
  if (!type) return NextResponse.json({ error: "Type is required" }, { status: 400 });
  const activity = await Activity.create({ user: user.id, type, details });
  return NextResponse.json(activity, { status: 201 });
} 