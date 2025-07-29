import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import Testimonial from '../../../../models/Testimonial';

export async function GET() {
  try {
    await dbConnect();
    
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);
    
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, role, content, rating, avatar, isActive, order } = body;
    
    // Validate required fields
    if (!name || !role || !content) {
      return NextResponse.json(
        { error: 'Name, role, and content are required' },
        { status: 400 }
      );
    }
    
    const testimonial = new Testimonial({
      name,
      role,
      content,
      rating: rating || 5,
      avatar: avatar || '/team-member-icon.jpg',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });
    
    await testimonial.save();
    
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
} 