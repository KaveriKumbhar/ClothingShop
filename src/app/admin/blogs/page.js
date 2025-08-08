"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load blogs");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setBlogs(blogs.filter((b) => b.slug !== slug));
    } else {
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <Link href="/admin/blogs/add">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Add Blog
          </button>
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Author</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.slug} className="border-b">
                <td className="p-2">
                  {blog.image ? (
                    <Image src={blog.image} alt={blog.title} className="h-12 w-20 object-cover rounded border" height={48} width={80} />
                  ) : (
                    <span className="text-muted-foreground text-xs">No image</span>
                  )}
                </td>
                <td className="p-2">{blog.title}</td>
                <td className="p-2">{blog.author}</td>
                <td className="p-2">{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="p-2 flex gap-2">
                  <Link href={`/admin/blogs/edit/${blog.slug}`}>
                    <button className="px-3 py-1 bg-accent text-accent-foreground rounded hover:bg-accent/80">Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(blog.slug)} className="px-3 py-1 bg-destructive text-white rounded hover:bg-destructive/80">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 