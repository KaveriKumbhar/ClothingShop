"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setBlog(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load blog");
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !blog) return <div className="p-8 text-center text-destructive">Blog not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      {/* <section className="relative overflow-hidden pt-36 pb-36">
        <Image src="/blogs-banner.jpg" alt="Blogs Banner" className="absolute inset-0 w-full h-full object-cover object-center z-0" style={{ minHeight: '520px', maxHeight: '700px', opacity: 0.5 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        <div className="container-responsive relative z-20 py-36 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow line-clamp-2">{blog.title}</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow mb-2">By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}</p>
        </div>
      </section> */}
      <section className="relative overflow-hidden pt-36 pb-36">
        <Image src="/blogs-banner.jpg" alt="Blogs Banner" height={700} width={1200} className="absolute inset-0 w-full h-full object-cover object-center z-0" style={{ minHeight: '520px', maxHeight: '700px', opacity: 0.5 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        <div className="container-responsive relative z-20 py-36 flex flex-col items-center justify-center text-center">
          {/* Breadcrumb on banner */}
          <nav className="flex items-center gap-3 text-lg text-black mb-8 drop-shadow font-semibold">
            <Link href="/" className="flex items-center hover:underline">
              <svg className="w-6 h-6 mr-2 " fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>
            <span>/</span>
            <Link href="/blogs" className="hover:underline">Blogs</Link>
            <span>/</span>
            <span className="font-bold line-clamp-1">{blog.title}</span>
          </nav>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow line-clamp-2">{blog.title}</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow mb-2">By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}</p>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6 drop-shadow">
            Explore the latest news, style tips, and stories from the world of fashion. Stay inspired and discover what&apos;s trending!
          </p>

        </div>
      </section>
      {/* Breadcrumb */}
      {/* <nav className="container-responsive max-w-2xl mx-auto flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/blogs" className="hover:underline">Blogs</Link>
        <span>/</span>
        <span className="text-card-foreground font-semibold line-clamp-1">{blog.title}</span>
      </nav> */}
      <div className="container-responsive flex justify-center py-16 ">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-0 overflow-hidden min-w-[320px] max-w-2xl w-full mt-12 mb-12">
          {/* Small avatar-style image */}
          {/* {blog.image && (
            <div className="flex justify-center pt-8">
              <Image src={blog.image} alt={blog.title} className="w-20 h-20 rounded-full object-cover object-center border-4 border-primary/20 shadow" />
            </div>
          )} */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-card-foreground mb-2 line-clamp-2 text-center">{blog.title}</h1>
            <p className="text-muted-foreground mb-4 text-center text-base">By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}</p>
            {/* Full-width image */}
            {blog.image && (
              <div className="w-full rounded-xl overflow-hidden mb-8 mt-4 shadow">
                <Image src={blog.image} alt={blog.title} height={500} width={800} className="w-full h-80 object-cover object-center" />
              </div>
            )}
            <div className="prose max-w-none text-lg text-black/90 mx-auto">
              <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 