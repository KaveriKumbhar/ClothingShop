import { jwtVerify } from 'jose';
import mongoose from 'mongoose';

// Helper function to get user from token
export async function getUserFromToken(cookies) {
  console.log('Getting token from cookies...');
  const token = await cookies.get('token')?.value;
  console.log('Token found:', !!token);
  
  if (!token) {
    console.log('No token found');
    return null;
  }
  
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_key')
    );
    
    // Handle both old (ObjectId object) and new (string) JWT formats
    let userId = payload.id;
    
    // If userId is an object with buffer property (old format), convert it
    if (userId && typeof userId === 'object' && userId.buffer) {
      try {
        // Convert the buffer object to a proper hex string
        const bufferValues = Object.values(userId.buffer);
        const hexString = Buffer.from(bufferValues).toString('hex');
        userId = hexString;
        console.log('Converted ObjectId buffer to hex string:', hexString);
      } catch (error) {
        console.error('Error converting ObjectId buffer:', error);
        // Fallback: try to get string representation
        userId = userId.toString ? userId.toString() : JSON.stringify(userId);
      }
    }
    
    console.log('Token decoded successfully:', { 
      id: userId, 
      email: payload.email, 
      role: payload.role 
    });
    
    return {
      ...payload,
      id: userId
    };
  } catch (err) {
    console.error('JWT verification error:', err);
    return null;
  }
}

// Helper function to verify admin role
export async function verifyAdmin(req) {
  const userData = await getUserFromToken(req);
  if (!userData || userData.role !== 'admin') {
    return null;
  }
  return userData;
}

// Helper function to verify user role
export async function verifyUser(req) {
  const userData = await getUserFromToken(req);
  if (!userData || userData.role !== 'user') {
    return null;
  }
  return userData;
} 