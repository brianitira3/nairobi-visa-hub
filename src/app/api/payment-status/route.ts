import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { nationalId, status } = await request.json();

    if (!nationalId) {
      return NextResponse.json({ error: 'National ID is required' }, { status: 400 });
    }

    if (!status || !['pending_verification', 'completed', 'failed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
    }

    // Find user by nationalId
    const user = await User.findOne({ nationalId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update payment status
    user.applicationStatus = {
      ...user.applicationStatus,
      paymentStatus: status,
      paymentReference: status === 'completed' ? `MPESA-${Date.now()}` : null,
    };

    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Payment status updated successfully',
      paymentStatus: status
    });

  } catch (error) {
    console.error('Payment status update error:', error);
    return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
  }
}
