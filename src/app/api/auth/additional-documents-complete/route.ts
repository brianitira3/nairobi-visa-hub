import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { nationalId } = body;

    if (!nationalId) {
      return NextResponse.json(
        { error: 'National ID is required' },
        { status: 400 }
      );
    }

    // Find user and mark additional documents as complete
    const user = await User.findOne({ nationalId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Mark additional documents as complete
    user.additionalDocumentsComplete = true;
    await user.save();

    return NextResponse.json(
      { message: 'Additional documents marked as complete' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Complete additional documents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
