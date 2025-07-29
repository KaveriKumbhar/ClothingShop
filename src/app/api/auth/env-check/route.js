import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    jwtSecret: process.env.JWT_SECRET ? "Set" : "Not set",
    nodeEnv: process.env.NODE_ENV,
    testEnv: process.env.TEST_ENV,
    hasMongoUri: !!process.env.MONGODB_URI
  });
} 