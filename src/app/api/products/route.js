import { dbConnect } from "../../../../lib/mongodb";
import Product from "../../../../models/product";

export async function GET(request) {
  await dbConnect();
  const products = await Product.find({});
  return Response.json(products);
}

export async function POST(request) {
  await dbConnect();
  const { name, price, image, category, ...rest } = await request.json();
  console.log("[PRODUCTS API] POST payload:", { name, price, image, category });
  console.log("[PRODUCTS API] Using MONGODB_URI:", process.env.MONGODB_URI);
  if (!name || !price || !image || !category) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
  }
  try {
    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const product = await Product.create({ name, price, image, category, slug });
    console.log("[PRODUCTS API] Product saved:", product);
    return Response.json(product, { status: 201 });
  } catch (err) {
    console.error('[PRODUCTS API] Product creation error:', err);
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return Response.json({ error: "A product with this name already exists." }, { status: 400 });
    }
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
} 