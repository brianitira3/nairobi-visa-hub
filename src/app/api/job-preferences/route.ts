import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { nationalId, jobPreferences } = await request.json();
    
    console.log('Received job preferences save request:', { nationalId, jobPreferences });
    
    if (!nationalId) {
      return NextResponse.json(
        { error: 'National ID is required' },
        { status: 400 }
      );
    }
    
    // First, find the user to check if they exist
    const existingUser = await User.findOne({ nationalId });
    console.log('Existing user found:', existingUser ? 'Yes' : 'No');
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('User current jobPreferences:', existingUser.jobPreferences);
    
    // Update the user
    const user = await User.findOneAndUpdate(
      { nationalId },
      { $set: { jobPreferences } },
      { new: true, upsert: false }
    );
    
    console.log('Updated user job preferences:', user.jobPreferences);
    
    return NextResponse.json(
      { message: 'Job preferences saved successfully', jobPreferences: user.jobPreferences },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving job preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    const { nationalId } = await request.json();
    
    if (!nationalId) {
      return NextResponse.json(
        { error: 'National ID is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findOneAndUpdate(
      { nationalId },
      { 
        jobPreferences: null,
        applicationStatus: {
          submitted: false,
          appointmentBooked: false,
          paymentStatus: null
        },
        applicationDocuments: null
      },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Job preferences deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting job preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
