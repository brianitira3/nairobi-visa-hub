import connectDB from '@/lib/db';
import Ticket from '@/models/Ticket';

const TICKET_NUMBERS = [
  '7284', '3951', '8462', '5173', '6928',
  '4837', '9156', '2749', '6385', '1947',
  '8263', '5719', '3492', '7158', '4625',
  '8934', '2571', '6148', '3892', '9456'
];

export async function seedTickets() {
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
    
    console.log('Successfully seeded 20 ticket numbers');
    return { success: true, message: 'Tickets seeded successfully' };
  } catch (error) {
    console.error('Error seeding tickets:', error);
    return { success: false, error: 'Failed to seed tickets' };
  }
}

// Run if called directly
if (require.main === module) {
  seedTickets();
}
