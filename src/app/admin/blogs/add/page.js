"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/blogs/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.ok && data.filePath) {
      setImage(data.filePath);
      setImageFile(file);
    } else {
      setError(data.error || 'Image upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, author, image }),
    });
    if (res.ok) {
      router.push("/admin/blogs");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add blog");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8">
      <div className="w-full max-w-2xl bg-card rounded-2xl shadow-xl border border-border p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Add New Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-card-foreground">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground placeholder-muted-foreground" placeholder="Enter blog title" />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-card-foreground">Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} required rows={8} className="w-full border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground placeholder-muted-foreground" placeholder="Write your blog content..." />
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block font-semibold mb-2 text-card-foreground">Author</label>
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)} required className="w-full border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground placeholder-muted-foreground" placeholder="Author name" />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-2 text-card-foreground">Image (optional)</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-border px-4 py-2 rounded-lg bg-background" />
              {uploading && <p className="text-muted-foreground text-sm mt-1">Uploading...</p>}
              {image && (
                <div className="mt-2">
                  <img src={image} alt="Preview" className="h-32 rounded-lg border object-cover" />
                </div>
              )}
            </div>
          </div>
          {error && <p className="text-destructive text-center font-medium">{error}</p>}
          <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
            {loading ? "Adding..." : "Add Blog"}
          </button>
        </form>
      </div>
    </div>
  );
} 