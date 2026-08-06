import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Ticket from '@/models/Ticket';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { nationalId, ticketNumber } = await request.json();
    
    if (!nationalId || !ticketNumber) {
      return NextResponse.json(
        { error: 'National ID and ticket number are required' },
        { status: 400 }
      );
    }
    
    // Validate ticket number format (4 digits)
    if (!/^\d{4}$/.test(ticketNumber)) {
      return NextResponse.json(
        { error: 'Invalid ticket number format' },
        { status: 400 }
      );
    }
    
    // Find the ticket
    const ticket = await Ticket.findOne({ ticketNumber });
    
    if (!ticket) {
      return NextResponse.json(
        { error: 'Invalid ticket number' },
        { status: 404 }
      );
    }
    
    // Check if ticket is already used
    if (ticket.isUsed) {
      return NextResponse.json(
        { error: 'This ticket has already been used' },
        { status: 400 }
      );
    }
    
    // Find the user
    const user = await User.findOne({ nationalId });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Mark ticket as used
    ticket.isUsed = true;
    ticket.usedBy = user._id;
    ticket.usedAt = new Date();
    await ticket.save();
    
    // Update user's payment status and ticket number
    user.applicationStatus.paymentStatus = 'completed';
    user.ticketNumber = ticketNumber;
    await user.save();
    
    return NextResponse.json(
      { 
        message: 'Ticket verified successfully', 
        ticketNumber: ticket.ticketNumber,
        appointmentDate: user.applicationStatus.appointmentDate,
        appointmentTime: user.applicationStatus.appointmentTime
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
