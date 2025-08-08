"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../../../components/ProductCard";
import Image from "next/image";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/blogs").then((res) => res.json()),
    ]).then(([productsData, blogsData]) => {
      const q = query.toLowerCase();
      setProducts(
        (productsData || []).filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        )
      );
      setBlogs(
        (blogsData || []).filter(
          (b) =>
            b.title?.toLowerCase().includes(q) ||
            b.content?.toLowerCase().includes(q)
        )
      );
      setLoading(false);
    });
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container-responsive max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          <p className="text-muted-foreground">Please enter a search query.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container-responsive max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Search results for {query}
        </h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Products</h2>
              {products.length === 0 ? (
                <p className="text-muted-foreground">No matching products found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">Blogs</h2>
              {blogs.length === 0 ? (
                <p className="text-muted-foreground">No matching blogs found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {blogs.map((blog) => (
                    <Link key={blog.slug} href={`/blogs/${blog.slug}`} className="block bg-card rounded-lg shadow hover:shadow-lg transition p-6">
                      {blog.image && (
                        <Image  src={blog.image} height={500} width={500} alt={blog.title} className="w-full h-40 object-cover rounded mb-4" />
                      )}
                      <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                      <p className="text-muted-foreground mb-2">By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}</p>
                      <p className="line-clamp-2 text-black/80">{blog.content}</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
} 