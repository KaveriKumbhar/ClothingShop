import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import Contact from "../../../../models/Contact";

export async function POST(req) {
  await dbConnect();
  const { name, email, mobile, message } = await req.json();
  if (!name || !email || !mobile || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  const contact = await Contact.create({ name, email, mobile, message });
  return NextResponse.json({ success: true, contact }, { status: 201 });
}

export async function GET() {
  await dbConnect();
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return NextResponse.json({ contacts });
} 