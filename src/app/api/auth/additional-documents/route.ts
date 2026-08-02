import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { nationalId, passport, yellowFever, drivingLicense } = body;

    if (!nationalId) {
      return NextResponse.json(
        { error: 'National ID is required' },
        { status: 400 }
      );
    }

    if (!passport && !yellowFever && !drivingLicense) {
      return NextResponse.json(
        { error: 'At least one document is required' },
        { status: 400 }
      );
    }

    // Validate base64 strings if provided
    const updateData: any = {};
    if (passport) {
      if (!passport.startsWith('data:image/')) {
        return NextResponse.json(
          { error: 'Invalid passport image format' },
          { status: 400 }
        );
      }
      updateData.passport = passport;
    }
    if (yellowFever) {
      if (!yellowFever.startsWith('data:image/')) {
        return NextResponse.json(
          { error: 'Invalid yellow fever card image format' },
          { status: 400 }
        );
      }
      updateData.yellowFever = yellowFever;
    }
    if (drivingLicense) {
      if (!drivingLicense.startsWith('data:image/')) {
        return NextResponse.json(
          { error: 'Invalid driving license image format' },
          { status: 400 }
        );
      }
      updateData.drivingLicense = drivingLicense;
    }

    // Find and update user
    const user = await User.findOneAndUpdate(
      { nationalId },
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Additional documents uploaded successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Additional documents upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
