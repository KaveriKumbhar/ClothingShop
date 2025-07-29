import { dbConnect } from '../lib/mongodb.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/product.js';

async function seedOrders() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Get a test user (create one if doesn't exist)
    let user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });
      console.log('Created test user');
    }

    // Get some products
    const products = await Product.find({}).limit(5);
    if (products.length === 0) {
      console.log('No products found. Please seed products first.');
      return;
    }

    // Clear existing orders
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Create sample orders with different statuses
    const sampleOrders = [
      {
        userId: user._id,
        items: [
          {
            product: {
              _id: products[0]._id,
              name: products[0].name,
              price: products[0].price,
              image: products[0].image,
              slug: products[0].slug
            },
            quantity: 2
          }
        ],
        totalAmount: products[0].price * 2,
        status: 'pending',
        shippingAddress: {
          name: 'John Doe',
          phone: '+91 9876543210',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid'
      },
      {
        userId: user._id,
        items: [
          {
            product: {
              _id: products[1]?._id || products[0]._id,
              name: products[1]?.name || products[0].name,
              price: products[1]?.price || products[0].price,
              image: products[1]?.image || products[0].image,
              slug: products[1]?.slug || products[0].slug
            },
            quantity: 1
          }
        ],
        totalAmount: (products[1]?.price || products[0].price) * 1,
        status: 'processing',
        shippingAddress: {
          name: 'Jane Smith',
          phone: '+91 9876543211',
          address: '456 Oak Avenue',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        paymentMethod: 'UPI',
        paymentStatus: 'paid'
      },
      {
        userId: user._id,
        items: [
          {
            product: {
              _id: products[2]?._id || products[0]._id,
              name: products[2]?.name || products[0].name,
              price: products[2]?.price || products[0].price,
              image: products[2]?.image || products[0].image,
              slug: products[2]?.slug || products[0].slug
            },
            quantity: 3
          }
        ],
        totalAmount: (products[2]?.price || products[0].price) * 3,
        status: 'shipped',
        shippingAddress: {
          name: 'Bob Johnson',
          phone: '+91 9876543212',
          address: '789 Pine Road',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        },
        paymentMethod: 'Net Banking',
        paymentStatus: 'paid'
      },
      {
        userId: user._id,
        items: [
          {
            product: {
              _id: products[3]?._id || products[0]._id,
              name: products[3]?.name || products[0].name,
              price: products[3]?.price || products[0].price,
              image: products[3]?.image || products[0].image,
              slug: products[3]?.slug || products[0].slug
            },
            quantity: 1
          }
        ],
        totalAmount: (products[3]?.price || products[0].price) * 1,
        status: 'delivered',
        shippingAddress: {
          name: 'Alice Brown',
          phone: '+91 9876543213',
          address: '321 Elm Street',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipCode: '600001',
          country: 'India'
        },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'paid'
      },
      {
        userId: user._id,
        items: [
          {
            product: {
              _id: products[4]?._id || products[0]._id,
              name: products[4]?.name || products[0].name,
              price: products[4]?.price || products[0].price,
              image: products[4]?.image || products[0].image,
              slug: products[4]?.slug || products[0].slug
            },
            quantity: 2
          }
        ],
        totalAmount: (products[4]?.price || products[0].price) * 2,
        status: 'cancelled',
        shippingAddress: {
          name: 'Charlie Wilson',
          phone: '+91 9876543214',
          address: '654 Maple Drive',
          city: 'Kolkata',
          state: 'West Bengal',
          zipCode: '700001',
          country: 'India'
        },
        paymentMethod: 'Credit Card',
        paymentStatus: 'failed'
      }
    ];

    const insertedOrders = await Order.insertMany(sampleOrders);
    console.log(`Created ${insertedOrders.length} sample orders with different statuses`);
    
    console.log('Order statuses created:');
    insertedOrders.forEach(order => {
      console.log(`- Order #${order.orderNumber}: ${order.status}`);
    });

  } catch (error) {
    console.error('Error seeding orders:', error);
  } finally {
    process.exit();
  }
}

seedOrders(); 