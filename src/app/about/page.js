import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background w-full pb-12">
      {/* Banner Section */}
      <section className="relative overflow-hidden pt-40 pb-40">
        <Image src="/about-banner.jpg" alt="About Banner" className="absolute inset-0 w-full h-full object-cover object-center z-0" style={{ minHeight: '520px', maxHeight: '700px', opacity: 0.5 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        <div className="container-responsive relative z-20 py-36 flex flex-col items-center justify-center text-center">
          {/* Breadcrumb on banner */}
          <nav className="flex items-center gap-3 text-lg text-black mb-8 drop-shadow font-semibold">
            <Link href="/" className="flex items-center hover:underline">
              <svg className="w-6 h-6 mr-2 " fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </Link>
            <span>/</span>
            <span className="font-bold">About</span>
          </nav>
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow">About Us</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
            Welcome to our clothing ecommerce platform! We are passionate about providing premium clothing and accessories for everyone.
          </p>
        </div>
      </section>
      {/* Breadcrumb */}
      {/* Mission & Values Section */}
      <section className="container-responsive max-w-4xl mx-auto mt-20 mb-20 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-20 ">
          <div className="bg-card rounded-xl shadow p-8 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-muted-foreground">To deliver quality, style, and value to our customers with a seamless online shopping experience.</p>
          </div>
          <div className="bg-card rounded-xl shadow p-8 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-success/10">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Values</h3>
            <p className="text-muted-foreground">Integrity, customer focus, and a passion for fashion drive everything we do.</p>
          </div>
          <div className="bg-card rounded-xl shadow p-8 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-warning/10">
              <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
            <p className="text-muted-foreground">To be the go-to destination for fashion-forward individuals worldwide.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container-responsive max-w-5xl mx-auto mb-20 ">
        <h2 className="text-3xl font-bold text-center mt-20 mb-10">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden">
              <Image src="/team-member-icon.jpg" alt="Team Member Icon" className="w-14 h-14 object-contain" />
            </div>
            <h4 className="text-lg font-semibold">John</h4>
            <p className="text-muted-foreground mb-2">Founder & CEO</p>
            <p className="text-sm text-muted-foreground">Visionary leader with a passion for fashion and innovation.</p>
          </div>
          <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden">
              <Image src="/team-member-icon.jpg" alt="Team Member Icon" className="w-14 h-14 object-contain" height={100} width={100}/>
            </div>
            <h4 className="text-lg font-semibold">John</h4>
            <p className="text-muted-foreground mb-2">Head of Design</p>
            <p className="text-sm text-muted-foreground">Creative mind behind our unique and stylish collections.</p>
          </div>
          <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden">
              <Image src="/team-member-icon.jpg" alt="Team Member Icon" className="w-14 h-14 object-contain" height={100} width={100} />
            </div>
            <h4 className="text-lg font-semibold">John</h4>
            <p className="text-muted-foreground mb-2">Customer Success</p>
            <p className="text-sm text-muted-foreground">Ensuring every customer has a seamless shopping experience.</p>
          </div>
        </div>
      </section>

      {/* Timeline/Story Section */}
      <section className="container-responsive max-w-4xl mx-auto mb-20 ">
        <h2 className="text-3xl font-bold text-center mb-10 mt-20">Our Journey</h2>
        <ol className="relative border-l-4 border-primary/20 ml-4">
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
            </span>
            <h3 className="font-semibold text-lg text-primary">Founded in 2020</h3>
            <p className="text-muted-foreground">Our journey began with a vision to make premium fashion accessible to everyone.</p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-success rounded-full -left-4 ring-4 ring-white">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
            </span>
            <h3 className="font-semibold text-lg text-success">2021: First Collection Launch</h3>
            <p className="text-muted-foreground">We launched our first collection, receiving overwhelming support from our customers.</p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-warning rounded-full -left-4 ring-4 ring-white">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
            </span>
            <h3 className="font-semibold text-lg text-warning">2023: Expanding Worldwide</h3>
            <p className="text-muted-foreground">We expanded our reach globally, serving fashion lovers around the world.</p>
          </li>
        </ol>
      </section>

      {/* Call to Action Section */}
      <section className="container-responsive max-w-2xl mx-auto text-center mb-20">
        <div className="bg-blue-400 rounded-2xl py-12 px-8 shadow-lg mt-20">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Fashion Journey</h2>
          <p className="text-white/90 mb-6">Discover the latest trends, enjoy exclusive offers, and be part of our vibrant community.</p>
          <Link href="/products" className="inline-block px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors btn-hover text-lg">Shop Now</Link>
        </div>
      </section>
    </div>
  );
} 