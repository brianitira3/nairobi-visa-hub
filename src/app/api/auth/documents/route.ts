import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { nationalId, nationalIdFront, nationalIdBack } = body;

    if (!nationalId) {
      return NextResponse.json(
        { error: 'National ID is required' },
        { status: 400 }
      );
    }

    if (!nationalIdFront || !nationalIdBack) {
      return NextResponse.json(
        { error: 'Both front and back images are required' },
        { status: 400 }
      );
    }

    // Validate base64 strings
    if (!nationalIdFront.startsWith('data:image/') || !nationalIdBack.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    // Find and update user
    const user = await User.findOneAndUpdate(
      { nationalId },
      { nationalIdFront, nationalIdBack },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Updated user with documents:', user.nationalId ? user.nationalId : 'unknown');

    return NextResponse.json(
      { message: 'Documents uploaded successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
