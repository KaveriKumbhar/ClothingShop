"use client";

import { useState } from "react";
import Link from "next/link";
import useCategories from "../../../hooks/useCategories";
import useProducts from "../../../hooks/useProducts";

export default function CategoriesPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { products, loading: productsLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Get product count for each category
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    productCount: products.filter(product => product.category === category.slug).length
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-gradient-primary w-full">
        <div className="container-responsive text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Product Categories
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Explore our diverse range of clothing categories. 
            Each category is carefully curated to match your style preferences.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container-responsive">
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                  <div className="bg-muted h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : categoriesError ? (
            <div className="text-center py-12">
              <p className="text-destructive">{categoriesError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoriesWithCounts.map((category) => (
                <div
                  key={category._id || category.slug}
                  className="bg-card rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {/* Category Image Placeholder */}
                  <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-4xl font-bold text-primary">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-card-foreground">
                        {category.name}
                      </h3>
                      <span className="text-sm text-muted-foreground bg-accent px-2 py-1 rounded-full">
                        {category.productCount} products
                      </span>
                    </div>
                    
                    {category.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/products?category=${category.slug}`}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors text-center"
                      >
                        View Products
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(category);
                        }}
                        className="px-4 py-2 border border-border text-card-foreground text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Details Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-card-foreground">
                  {selectedCategory.name}
                </h2>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-muted-foreground hover:text-card-foreground"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {selectedCategory.description && (
                  <p className="text-muted-foreground">
                    {selectedCategory.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>{selectedCategory.productCount} products available</span>
                </div>

                <div className="flex gap-2 pt-4">
                  <Link
                    href={`/products?category=${selectedCategory.slug}`}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-center"
                  >
                    Browse Products
                  </Link>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="px-4 py-2 border border-border text-card-foreground font-medium rounded-lg hover:bg-accent transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 