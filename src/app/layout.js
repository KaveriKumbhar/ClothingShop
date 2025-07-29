import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../../components/Navbar";
import { CartProvider } from "../../hooks/useCart";
import { AuthProvider } from "../../hooks/useAuth";
import SideCart from "../../components/SideCart";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../lib/auth";
import Footer from '../../components/Footer';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "FashionHub - Premium Clothing Store",
  description: "Discover the latest trends in fashion with our premium clothing collection. Shop for men's and women's clothing, accessories, and more.",
  keywords: "fashion, clothing, style, premium, boutique, online shopping",
  authors: [{ name: "FashionHub Team" }],
  creator: "FashionHub",
  publisher: "FashionHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "FashionHub - Premium Clothing Store",
    description: "Discover the latest trends in fashion with our premium clothing collection.",
    url: "http://localhost:3000",
    siteName: "FashionHub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FashionHub - Premium Clothing Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FashionHub - Premium Clothing Store",
    description: "Discover the latest trends in fashion with our premium clothing collection.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const user = await getUserFromToken(cookieStore);
  console.log('Layout - User from token:', user);
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <SideCart />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
