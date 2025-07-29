export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container-responsive max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-card-foreground">Returns & Exchanges</h1>
        <div className="space-y-6 text-muted-foreground">
          <p>We want you to love your purchase! If you’re not satisfied, you can return or exchange most items within 30 days of delivery.</p>
          <ul className="list-disc pl-6">
            <li>Items must be unused and in original packaging</li>
            <li>Easy online return request via your account</li>
            <li>Refunds processed within 5-7 business days after receipt</li>
            <li>Exchanges subject to stock availability</li>
          </ul>
          <p>For help, please <a href="/contact" className="text-primary underline">contact our support team</a>.</p>
        </div>
      </div>
    </div>
  );
} 