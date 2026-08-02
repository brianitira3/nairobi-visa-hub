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

    // Find user by national ID
    const user = await User.findOne({ nationalId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Login successful', 
        user: { 
          phone: user.phone, 
          nationalId: user.nationalId,
          fullName: user.fullName,
          location: user.location,
          email: user.email,
          profileComplete: !!(user.fullName && user.location && user.email),
          documentsComplete: !!(user.nationalIdFront && user.nationalIdBack),
          additionalDocumentsComplete: !!(user.passport && user.yellowFever)
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
