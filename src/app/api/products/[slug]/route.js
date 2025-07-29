import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/mongodb";
import Product from "../../../../../models/product";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const product = await Product.findOne({ slug });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { slug } = params;
  const data = await request.json();
  
  // If name is being updated, generate new slug
  if (data.name) {
    data.slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  
  const product = await Product.findOneAndUpdate({ slug }, data, { new: true });
  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
  return Response.json(product);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { slug } = params;
  const product = await Product.findOneAndDelete({ slug });
  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
  return Response.json({ success: true });
} 