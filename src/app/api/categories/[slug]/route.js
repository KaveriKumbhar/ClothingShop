import { dbConnect } from "../../../../../lib/mongodb";
import Category from "../../../../../models/Category";

export async function GET(request, { params }) {
  await dbConnect();
  const { slug } = params;
  const category = await Category.findOne({ slug });
  if (!category) {
    return Response.json({ error: "Category not found" }, { status: 404 });
  }
  return Response.json(category);
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
  
  const category = await Category.findOneAndUpdate({ slug }, data, { new: true });
  if (!category) {
    return Response.json({ error: "Category not found" }, { status: 404 });
  }
  return Response.json(category);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { slug } = params;
  const category = await Category.findOneAndDelete({ slug });
  if (!category) {
    return Response.json({ error: "Category not found" }, { status: 404 });
  }
  return Response.json({ success: true });
} 