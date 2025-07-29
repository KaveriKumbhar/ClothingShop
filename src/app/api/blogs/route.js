import { dbConnect } from '../../../../lib/mongodb';
import Blog from '../../../../models/Blog';

export async function GET(req) {
  await dbConnect();
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return Response.json(blogs);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();
    const blog = new Blog(data);
    await blog.save();
    return Response.json(blog, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to create blog' }, { status: 400 });
  }
}

// Optional: DELETE all blogs (admin only, not for production use)
export async function DELETE(req) {
  await dbConnect();
  try {
    await Blog.deleteMany({});
    return Response.json({ message: 'All blogs deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete blogs' }, { status: 500 });
  }
} 