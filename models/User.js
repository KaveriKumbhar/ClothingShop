import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  phone: { type: String, default: "" },
  addresses: [{
    type: { type: String, enum: ["home", "work", "other"], default: "home" },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: "US" },
    isDefault: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true }
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate slugs for addresses if they don't have one
  if (this.addresses && this.addresses.length > 0) {
    this.addresses.forEach(address => {
      if (!address.slug) {
        const timestamp = Date.now();
        const addressString = `${address.street}-${address.city}-${address.state}-${address.zipCode}`;
        address.slug = `${addressString.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}`;
      }
    });
  }
  
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema); 