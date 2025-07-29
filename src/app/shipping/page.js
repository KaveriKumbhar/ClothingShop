export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container-responsive max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-card-foreground">Shipping Information</h1>
        <div className="space-y-6 text-muted-foreground">
          <p>We offer free shipping on all orders over ₹50. Orders are processed within 1-2 business days and shipped via our trusted courier partners.</p>
          <ul className="list-disc pl-6">
            <li>Standard delivery time: 3-7 business days</li>
            <li>Express shipping available at checkout</li>
            <li>Order tracking provided via email/SMS</li>
            <li>We ship across India</li>
          </ul>
          <p>For more details, please <a href="/contact" className="text-primary underline">contact us</a>.</p>
        </div>
      </div>
    </div>
  );
} 