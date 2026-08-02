const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://adminvisa:rustEngineer1,@work-abroad-portal.kpawijf.mongodb.net/work-abroad-portal?appName=work-abroad-portal';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    console.log('Database name:', mongoose.connection.name);
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }
}

testConnection();
