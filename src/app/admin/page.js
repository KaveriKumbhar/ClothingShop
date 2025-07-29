"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ blogs: 0, products: 0, categories: 0, contacts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOverview();
  }, []);

  async function fetchOverview() {
    try {
      const [blogsRes, productsRes, categoriesRes, contactsRes] = await Promise.all([
        fetch("/api/blogs"),
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/contact")
      ]);
      const blogs = blogsRes.ok ? await blogsRes.json() : [];
      const products = productsRes.ok ? await productsRes.json() : [];
      const categories = categoriesRes.ok ? await categoriesRes.json() : [];
      const contacts = contactsRes.ok ? (await contactsRes.json()).contacts : [];
      setCounts({
        blogs: Array.isArray(blogs) ? blogs.length : blogs.length || 0,
        products: Array.isArray(products) ? products.length : products.length || 0,
        categories: Array.isArray(categories) ? categories.length : categories.length || 0,
        contacts: Array.isArray(contacts) ? contacts.length : contacts.length || 0
      });
    } catch {
      setError("Failed to load overview stats");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6">Welcome, Admin! Use the sidebar to manage products, categories, blogs, and user contacts.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-card rounded-xl shadow border border-border p-6 text-center">
          <h2 className="text-lg font-semibold text-primary mb-2">Blogs</h2>
          <div className="text-4xl font-bold text-card-foreground">{loading ? "-" : counts.blogs}</div>
        </div>
        <div className="bg-card rounded-xl shadow border border-border p-6 text-center">
          <h2 className="text-lg font-semibold text-primary mb-2">Products</h2>
          <div className="text-4xl font-bold text-card-foreground">{loading ? "-" : counts.products}</div>
        </div>
        <div className="bg-card rounded-xl shadow border border-border p-6 text-center">
          <h2 className="text-lg font-semibold text-primary mb-2">Categories</h2>
          <div className="text-4xl font-bold text-card-foreground">{loading ? "-" : counts.categories}</div>
        </div>
        <div className="bg-card rounded-xl shadow border border-border p-6 text-center">
          <h2 className="text-lg font-semibold text-primary mb-2">Contacts</h2>
          <div className="text-4xl font-bold text-card-foreground">{loading ? "-" : counts.contacts}</div>
        </div>
      </div>
      {error && <p className="text-destructive">{error}</p>}
    </div>
  );
} 