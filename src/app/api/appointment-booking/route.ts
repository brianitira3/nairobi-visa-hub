import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { nationalId, appointment } = await request.json();

    if (!nationalId) {
      return NextResponse.json({ error: 'National ID is required' }, { status: 400 });
    }

    if (!appointment?.date || !appointment?.time) {
      return NextResponse.json({ error: 'Appointment date and time are required' }, { status: 400 });
    }

    // Find user by nationalId
    const user = await User.findOne({ nationalId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if application has been submitted
    if (!user.applicationStatus?.submitted) {
      return NextResponse.json({ error: 'Please submit your application first' }, { status: 400 });
    }

    // Update appointment booking
    user.applicationStatus = {
      ...user.applicationStatus,
      appointmentBooked: true,
      appointmentDate: new Date(appointment.date),
      appointmentTime: appointment.time,
      paymentStatus: 'pending', // Will be updated after payment verification
    };

    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Appointment booked successfully' 
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json({ 
      error: 'Failed to book appointment' 
    }, { status: 500 });
  }
}
