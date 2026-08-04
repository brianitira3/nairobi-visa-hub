import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { phone, nationalId } = body;

    if (!phone || !nationalId) {
      return NextResponse.json(
        { error: 'Phone and National ID are required' },
        { status: 400 }
      );
    }

    // Validate phone format (+2547XXXXXXXX)
    const phoneRegex = /^\+2547\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Phone number must be in format +2547XXXXXXXX' },
        { status: 400 }
      );
    }

    // Validate National ID (8 digits)
    const idRegex = /^\d{8}$/;
    if (!idRegex.test(nationalId)) {
      return NextResponse.json(
        { error: 'National ID must be 8 digits' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ phone }, { nationalId }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this phone or National ID' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await User.create({
      phone,
      nationalId,
    });

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: { 
          phone: user.phone, 
          nationalId: user.nationalId,
          fullName: user.fullName,
          location: user.location,
          email: user.email,
          profileComplete: !!(user.fullName && user.location && user.email)
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
