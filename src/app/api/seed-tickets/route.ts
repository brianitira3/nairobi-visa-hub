import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Ticket from '@/models/Ticket';

const TICKET_NUMBERS = [
  '1234', '2345', '3456', '4567', '5678',
  '6789', '7890', '8901', '9012', '0123',
  '1357', '2468', '3579', '4680', '5791',
  '6802', '7913', '8024', '9135', '0246'
];

export async function POST() {
  try {
    await connectDB();
    
    // Clear existing tickets
    await Ticket.deleteMany({});
    
    // Insert new tickets
    const tickets = TICKET_NUMBERS.map(ticketNumber => ({
      ticketNumber,
      isUsed: false,
      usedBy: null,
      usedAt: null,
    }));
    
    await Ticket.insertMany(tickets);
    
    return NextResponse.json(
      { success: true, message: 'Successfully seeded 20 ticket numbers' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error seeding tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed tickets' },
      { status: 500 }
    );
  }
}
