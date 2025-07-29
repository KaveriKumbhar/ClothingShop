import { NextResponse } from "next/server";
import { getUserFromToken } from "../../../../../lib/auth";

export async function GET(req) {
  try {
    const userData = await getUserFromToken(req.cookies);
    
    if (!userData) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 