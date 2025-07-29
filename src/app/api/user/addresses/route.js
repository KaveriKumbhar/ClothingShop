import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import { getUserFromToken } from "../../../../../lib/auth";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    console.log('Addresses GET - Starting...');
    await dbConnect();
    console.log('Addresses GET - Database connected');
    
    const userData = await getUserFromToken(cookies());
    console.log('Addresses GET - User data:', userData);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userData.id).select('addresses');
    console.log('Addresses GET - User found:', !!user);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.addresses);
  } catch (error) {
    console.error('Addresses GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.log('Addresses POST - Starting...');
    await dbConnect();
    console.log('Addresses POST - Database connected');
    
    const userData = await getUserFromToken(cookies());
    console.log('Addresses POST - User data:', userData);
    
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addressData = await req.json();
    console.log('Addresses POST - Address data:', addressData);
    
    // Validate required fields
    if (!addressData.street || !addressData.city || !addressData.state || !addressData.zipCode) {
      return NextResponse.json({ error: "Street, city, state, and zip code are required" }, { status: 400 });
    }

    const user = await User.findById(userData.id);
    console.log('Addresses POST - User found:', !!user);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate slug from address data
    const slug = `${addressData.type}-${addressData.street.split(' ').slice(0, 2).join('-')}-${addressData.city}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    addressData.slug = slug;

    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      addressData.isDefault = true;
    }

    // If this address is set as default, unset others
    if (addressData.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(addressData);
    await user.save();
    console.log('Addresses POST - Address saved successfully');

    return NextResponse.json(user.addresses[user.addresses.length - 1], { status: 201 });
  } catch (error) {
    console.error('Addresses POST error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect();
  const userData = await getUserFromToken(cookies());
  if (!userData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { addressId, ...addressData } = await req.json();
  
  if (!addressId) {
    return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
  }

  const user = await User.findById(userData.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
  if (addressIndex === -1) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  // If this address is set as default, unset others
  if (addressData.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...addressData };
  await user.save();

  return NextResponse.json(user.addresses[addressIndex]);
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const userData = await getUserFromToken(cookies());
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const addressSlug = searchParams.get('slug');
    
    if (!addressSlug) {
      return NextResponse.json({ error: "Address slug is required" }, { status: 400 });
    }

    const user = await User.findById(userData.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const addressIndex = user.addresses.findIndex(addr => addr.slug === addressSlug);
    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const deletedAddress = user.addresses[addressIndex];
    user.addresses.splice(addressIndex, 1);

    // If we deleted the default address and there are other addresses, make the first one default
    if (deletedAddress.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Addresses DELETE error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 