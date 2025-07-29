export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container-responsive max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-card-foreground">Frequently Asked Questions</h1>
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg text-card-foreground mb-2">How do I place an order?</h2>
            <p className="text-muted-foreground">Browse our products, add items to your cart, and proceed to checkout. You’ll receive an order confirmation by email.</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-card-foreground mb-2">What payment methods do you accept?</h2>
            <p className="text-muted-foreground">We accept all major credit/debit cards, UPI, and net banking.</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-card-foreground mb-2">How can I track my order?</h2>
            <p className="text-muted-foreground">Once your order ships, you’ll receive a tracking link by email and SMS.</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-card-foreground mb-2">How do I contact support?</h2>
            <p className="text-muted-foreground">You can reach us via the <a href="/contact" className="text-primary underline">Contact</a> page or email us at support@fashionhub.com.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 