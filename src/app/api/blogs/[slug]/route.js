import { dbConnect } from '../../../../../lib/mongodb';
import Blog from '../../../../../models/Blog';

export async function GET(req, { params }) {
  await dbConnect();
  const { slug } = params;
  try {
    const blog = await Blog.findOne({ slug });
    if (!blog) return Response.json({ error: 'Blog not found' }, { status: 404 });
    return Response.json(blog);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  await dbConnect();
  const { slug } = params;
  try {
    const data = await req.json();
    const blog = await Blog.findOneAndUpdate({ slug }, data, { new: true, runValidators: true });
    if (!blog) return Response.json({ error: 'Blog not found' }, { status: 404 });
    return Response.json(blog);
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to update blog' }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { slug } = params;
  try {
    const blog = await Blog.findOneAndDelete({ slug });
    if (!blog) return Response.json({ error: 'Blog not found' }, { status: 404 });
    return Response.json({ message: 'Blog deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
} 