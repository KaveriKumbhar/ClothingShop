"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogsPage() {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <section className="relative overflow-hidden pt-36 pb-36">
        <img src="/blogs-banner.jpg" alt="Blogs Banner" className="absolute inset-0 w-full h-full object-cover object-center z-0" style={{ minHeight: '520px', maxHeight: '700px', opacity: 0.5 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        <div className="container-responsive relative z-20 py-36 flex flex-col items-center justify-center text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-3 text-lg text-black mb-8 drop-shadow font-semibold">
            <a href="/" className="flex items-center hover:underline">
              <svg className="w-6 h-6 mr-2 " fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </a>
            <span>/</span>
            <span className="font-bold">Blogs</span>
          </nav>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow">FashionHub Blog</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6 drop-shadow">
            Explore the latest news, style tips, and stories from the world of fashion. Stay inspired and discover what's trending!
          </p>
        </div>
      </section>

      <div className="container-responsive">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl shadow p-6  animate-pulse">
                <div className="w-full h-48 bg-muted rounded mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive text-center py-12">{error}</p>
        ) : blogs.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No blogs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-12 pb-12">
            {blogs.map((blog) => (
              <Link key={blog.slug} href={`/blogs/${blog.slug}`} className="group block bg-card rounded-xl shadow hover:shadow-xl transition p-6 border border-border hover:border-primary/40">
                {blog.image && (
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <h2 className="text-2xl font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">{blog.title}</h2>
                <p className="text-muted-foreground mb-2 text-sm">By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}</p>
                <p className="line-clamp-3 text-black/80 text-base mb-2">{blog.content}</p>
                <span className="inline-block mt-2 text-primary font-medium text-sm group-hover:underline">Read More</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 