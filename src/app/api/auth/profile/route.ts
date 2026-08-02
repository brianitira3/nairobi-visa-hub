import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { nationalId, fullName, location, email } = body;

    if (!nationalId) {
      return NextResponse.json(
        { error: 'National ID is required' },
        { status: 400 }
      );
    }

    if (!fullName || !location || !email) {
      return NextResponse.json(
        { error: 'Full name, location, and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Find and update user
    const user = await User.findOneAndUpdate(
      { nationalId },
      { fullName, location, email, profileComplete: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Profile updated successfully', user: { fullName: user.fullName, location: user.location, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
