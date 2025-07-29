import { dbConnect } from "../../../../lib/mongodb";
import Category from "../../../../models/Category";

export async function GET(request) {
  await dbConnect();
  const categories = await Category.find({});
  return Response.json(categories);
}

export async function POST(request) {
  await dbConnect();
  const { name } = await request.json();
  console.log("[CATEGORIES API] POST payload:", { name });
  console.log("[CATEGORIES API] Using MONGODB_URI:", process.env.MONGODB_URI);
  if (!name) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }
  
  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  
  const exists = await Category.findOne({ name });
  if (exists) {
    return Response.json({ error: "Category already exists." }, { status: 400 });
  }
  
  const category = await Category.create({ name, slug });
  console.log("[CATEGORIES API] Category saved:", category);
  return Response.json(category, { status: 201 });
} 