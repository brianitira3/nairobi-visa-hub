import connectDB from '@/lib/db';
import Job from '@/models/Job';

const sampleJobs = [
  {
    title: "Live-in Caregiver",
    description: "Provide care for elderly individuals in their homes. Responsibilities include assisting with daily activities, medication management, meal preparation, and companionship.",
    category: "Healthcare",
    location: "Dubai, UAE",
    salary: "KES 45,000 - 65,000 per month",
    requirements: ["Valid passport", "Medical certificate", "Caregiver certification preferred", "2+ years experience", "Age 25-45"],
    benefits: ["Free accommodation", "Medical insurance", "Annual leave", "Flight ticket home every 2 years"],
    company: "Al Maha Home Care Services",
    applicationDeadline: new Date('2025-12-31'),
    isActive: true
  },
  {
    title: "Housemaid / Domestic Helper",
    description: "General household duties including cleaning, cooking, laundry, and childcare for a family of 4. Must be reliable and hardworking.",
    category: "Hospitality",
    location: "Riyadh, Saudi Arabia",
    salary: "KES 35,000 - 50,000 per month",
    requirements: ["Valid passport", "Good health certificate", "Experience in housekeeping", "Age 22-40", "Basic cooking skills"],
    benefits: ["Free accommodation and food", "Medical insurance", "30 days annual leave", "Round-trip airfare"],
    company: "Royal Family Household",
    applicationDeadline: new Date('2025-11-30'),
    isActive: true
  },
  {
    title: "Construction Worker",
    description: "General construction work including concrete mixing, bricklaying, and site preparation. Experience with power tools preferred.",
    category: "Construction",
    location: "Doha, Qatar",
    salary: "KES 40,000 - 60,000 per month",
    requirements: ["Valid passport", "Physical fitness certificate", "Construction experience preferred", "Age 21-45", "Willing to work in hot conditions"],
    benefits: ["Shared accommodation", "Medical insurance", "Overtime pay available", "Transportation to work site"],
    company: "Qatar Construction Group",
    applicationDeadline: new Date('2026-01-15'),
    isActive: true
  },
  {
    title: "Hospitality Staff (Hotel)",
    description: "Work in a 5-star hotel as housekeeping staff. Responsibilities include room cleaning, linen management, and guest assistance.",
    category: "Hospitality",
    location: "Abu Dhabi, UAE",
    salary: "KES 38,000 - 55,000 per month",
    requirements: ["Valid passport", "Good health certificate", "Hotel experience preferred", "Age 20-40", "Good communication skills"],
    benefits: ["Shared accommodation", "Meals provided", "Medical insurance", "Tips and service charge", "Career advancement opportunities"],
    company: "Emirates Palace Hotel",
    applicationDeadline: new Date('2025-12-15'),
    isActive: true
  },
  {
    title: "Farm Worker (Agriculture)",
    description: "Work on a large farm planting, harvesting, and maintaining crops. Experience with modern farming equipment is an advantage.",
    category: "Agriculture",
    location: "Al Kharj, Saudi Arabia",
    salary: "KES 32,000 - 48,000 per month",
    requirements: ["Valid passport", "Physical fitness", "Agricultural experience preferred", "Age 20-50", "Willing to work outdoors"],
    benefits: ["Free accommodation", "Meals provided", "Medical insurance", "Seasonal bonuses"],
    company: "Saudi Agricultural Development Company",
    applicationDeadline: new Date('2026-02-28'),
    isActive: true
  },
  {
    title: "Factory Worker (Manufacturing)",
    description: "Assembly line work in a food processing factory. Tasks include packaging, quality control, and machine operation.",
    category: "Manufacturing",
    location: "Jeddah, Saudi Arabia",
    salary: "KES 35,000 - 52,000 per month",
    requirements: ["Valid passport", "Good health certificate", "Manufacturing experience preferred", "Age 21-45", "Attention to detail"],
    benefits: ["Shared accommodation", "Transportation provided", "Medical insurance", "Overtime opportunities", "Training provided"],
    company: "Saudi Food Industries",
    applicationDeadline: new Date('2026-01-31'),
    isActive: true
  },
  {
    title: "Nanny / Childcare Provider",
    description: "Care for children aged 2-8 years. Responsibilities include feeding, bathing, educational activities, and ensuring safety.",
    category: "Healthcare",
    location: "Kuwait City, Kuwait",
    salary: "KES 42,000 - 58,000 per month",
    requirements: ["Valid passport", "Medical certificate", "Childcare experience required", "Age 23-40", "First aid certification preferred"],
    benefits: ["Private room accommodation", "Food provided", "Medical insurance", "Annual leave", "Educational support for children"],
    company: "Kuwait Family Services",
    applicationDeadline: new Date('2025-12-20'),
    isActive: true
  },
  {
    title: "Driver (Private Family)",
    description: "Drive family members to various destinations including school, work, and appointments. Maintain vehicle cleanliness and safety.",
    category: "Other",
    location: "Dubai, UAE",
    salary: "KES 40,000 - 55,000 per month",
    requirements: ["Valid passport", "Valid driving license (3+ years)", "Clean driving record", "Age 25-50", "Knowledge of UAE roads preferred"],
    benefits: ["Shared accommodation", "Vehicle provided", "Medical insurance", "Fuel allowance", "Tips"],
    company: "Dubai Private Household",
    applicationDeadline: new Date('2026-01-10'),
    isActive: true
  },
  {
    title: "Restaurant Staff (Waiter/Waitress)",
    description: "Work in an upscale restaurant serving international cuisine. Take orders, serve food, and provide excellent customer service.",
    category: "Hospitality",
    location: "Manama, Bahrain",
    salary: "KES 36,000 - 50,000 per month",
    requirements: ["Valid passport", "Good health certificate", "Restaurant experience preferred", "Age 20-35", "Good English communication"],
    benefits: ["Shared accommodation", "Meals provided", "Tips and service charge", "Medical insurance", "Training programs"],
    company: "Bahrain Fine Dining Group",
    applicationDeadline: new Date('2025-11-15'),
    isActive: true
  },
  {
    title: "Security Guard",
    description: "Provide security for residential and commercial properties. Monitor CCTV, patrol premises, and maintain access control.",
    category: "Other",
    location: "Riyadh, Saudi Arabia",
    salary: "KES 38,000 - 54,000 per month",
    requirements: ["Valid passport", "Security guard certification", "Physical fitness", "Age 22-45", "Good communication skills"],
    benefits: ["Accommodation provided", "Medical insurance", "Uniform provided", "Transportation allowance", "Overtime pay"],
    company: "Saudi Security Services",
    applicationDeadline: new Date('2026-02-15'),
    isActive: true
  }
];

async function seedJobs() {
  try {
    await connectDB();
    
    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');
    
    // Insert sample jobs
    const insertedJobs = await Job.insertMany(sampleJobs);
    console.log(`Inserted ${insertedJobs.length} jobs`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
}

seedJobs();
