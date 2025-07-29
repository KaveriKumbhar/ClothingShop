import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true, enum: [
    "wishlist_add", "wishlist_remove", "order_placed", "address_added", "address_updated", "address_deleted"
  ] },
  details: { type: Object, default: {} }, // e.g., { productId, addressId, orderId, ... }
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema); 