"use client";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, message })
      });
      if (res.ok) {
        setStatus("Thank you for contacting us! We'll get back to you soon.");
        setName("");
        setEmail("");
        setMobile("");
        setMessage("");
      } else {
        setStatus("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Banner Section */}
      <section className="relative overflow-hidden pt-24 pb-24">
        <img src="/banner-fashion.jpg" alt="Contact Banner" className="absolute inset-0 w-full h-full object-cover object-center z-0" style={{ minHeight: '520px', maxHeight: '700px', opacity: 0.5 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        <div className="container-responsive relative z-20 py-36 flex flex-col items-center justify-center text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-3 text-lg text-white/90 mb-8 drop-shadow font-semibold">
            <a href="/" className="flex items-center hover:underline">
              <svg className="w-6 h-6 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </a>
            <span>/</span>
            <span className="font-bold">Contact</span>
          </nav>
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow">Contact Us</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
            Have a question, feedback, or need support? Fill out the form below and our team will get in touch with you as soon as possible.
          </p>
        </div>
      </section>
      <div className="container-responsive max-w-3xl mx-auto ">
        <div className="mb-12 text-center mt-12">
          <h1 className="text-4xl font-bold text-card-foreground mb-2">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Have a question, feedback, or need support? Fill out the form below and our team will get in touch with you as soon as possible.
          </p>
        </div>
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8 min-w-[320px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2 text-card-foreground">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground placeholder-muted-foreground"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-card-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground placeholder-muted-foreground"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-card-foreground">Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                required
                pattern="[0-9]{10,15}"
                className="w-full border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground placeholder-muted-foreground"
                placeholder="Your mobile number"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-card-foreground">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={6}
                className="w-full border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground placeholder-muted-foreground"
                placeholder="How can we help you?"
              />
            </div>
            {status && <div className="p-4 bg-success/10 text-success rounded-lg text-center font-medium">{status}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
          <div className="mt-10 border-t pt-8 text-center text-muted-foreground">
            <p className="mb-2">Or reach us at:</p>
            <p className="font-medium text-card-foreground">support@fashionhub.com</p>
            <p className="font-medium text-card-foreground">+1 (555) 123-4567</p>
            <p className="mt-2">123 Fashion Ave, New York, NY 10001</p>
          </div>
        </div>
      </div>
    </div>
  );
} 