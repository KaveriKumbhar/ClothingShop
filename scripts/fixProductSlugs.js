import mongoose from 'mongoose';
import Product from '../models/product.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdbname';

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const products = await Product.find({ $or: [ { slug: { $exists: false } }, { slug: null } ] });
  for (const product of products) {
    product.slug = slugify(product.name);
    await product.save();
    console.log(`Updated product: ${product.name} -> ${product.slug}`);
  }
  console.log('Done!');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 