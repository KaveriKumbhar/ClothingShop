import mongoose from "mongoose";

const WishlistItemSchema = new mongoose.Schema({
  product: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    slug: { type: String, required: true }
  },
  addedAt: { type: Date, default: Date.now }
});

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [WishlistItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

WishlistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema); 