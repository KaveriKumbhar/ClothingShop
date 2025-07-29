import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/mongodb';
import Testimonial from '../../../../../models/Testimonial';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const testimonial = await Testimonial.findById(params.id);
    
    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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
    
    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      {
        name,
        role,
        content,
        rating: rating || 5,
        avatar: avatar || '/team-member-icon.jpg',
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      },
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const testimonial = await Testimonial.findByIdAndDelete(params.id);
    
    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
} 