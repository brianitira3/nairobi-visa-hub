import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { nationalId } = await request.json();

    if (!nationalId) {
      return NextResponse.json({ error: 'National ID is required' }, { status: 400 });
    }

    // Find user by nationalId
    const user = await User.findOne({ nationalId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update application status - documents will be handled at appointment
    user.applicationStatus = {
      ...user.applicationStatus,
      submitted: true,
      submittedDate: new Date(),
    };

    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully' 
    });

  } catch (error) {
    console.error('Error saving application:', error);
    return NextResponse.json({ 
      error: 'Failed to save application' 
    }, { status: 500 });
  }
}
