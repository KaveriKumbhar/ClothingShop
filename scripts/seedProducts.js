import dotenv from 'dotenv';
dotenv.config(); // MUST be first!

console.log('Loaded MONGODB_URI:', process.env.MONGODB_URI);

import { dbConnect } from '../lib/mongodb.js';
import Product from '../models/product.js';

const products = [
  {
    name: "Classic Tee",
    price: 49.99,
    image: "/men/men1.jpg",
    category: "Men",
  },
  {
    name: "Summer Dress",
    price: 59.99,
    image: "/women/women1.jpg",
    category: "Women",
  },
  {
    name: "Kids Hoodie",
    price: 39.99,
    image: "/kids/kids1.jpg",
    category: "Kids",
  },
  {
    name: "Stylish Cap",
    price: 19.99,
    image: "/acc/acc1.jpg",
    category: "Accessories",
  },
];

async function seed() {
  await dbConnect();
  console.log('Connected to MongoDB');
  const deleted = await Product.deleteMany({});
  console.log('Deleted:', deleted);
  const inserted = await Product.insertMany(products);
  console.log('Inserted:', inserted);
  process.exit();
}

seed().catch((err) => {
  console.error('Seed script error:', err);
  process.exit(1);
});