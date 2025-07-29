import mongoose from 'mongoose';
import Category from '../models/Category.js';
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
  const categories = await Category.find({ $or: [ { slug: { $exists: false } }, { slug: null } ] });
  for (const category of categories) {
    category.slug = slugify(category.name);
    await category.save();
    console.log(`Updated category: ${category.name} -> ${category.slug}`);
  }
  console.log('Done!');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 