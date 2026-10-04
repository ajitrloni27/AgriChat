const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing database collections...');
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    console.log('👤 Creating demo accounts...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('securepassword123', salt);

    const users = await User.insertMany([
      {
        name: 'Basavaraj Patil',
        email: 'basavaraj@agrichat.com',
        password: passwordHash,
        role: 'farmer',
        village: 'Shirhatti',
        district: 'Gadag',
        state: 'Karnataka',
        preferredLanguage: 'kn',
        profilePic: '👨‍🌾',
      },
      {
        name: 'Dr. Ramesh Sharma',
        email: 'dr.sharma@agrichat.com',
        password: passwordHash,
        role: 'expert',
        village: 'Dharwad',
        district: 'Dharwad',
        state: 'Karnataka',
        preferredLanguage: 'en',
        profilePic: '🧑‍🔬',
      },
      {
        name: 'Kavita Hegde',
        email: 'kavita@agrichat.com',
        password: passwordHash,
        role: 'farmer',
        village: 'Sirsi',
        district: 'Uttara Kannada',
        state: 'Karnataka',
        preferredLanguage: 'kn',
        profilePic: '👩‍🌾',
      },
      {
        name: 'AgriChat Admin',
        email: 'admin@agrichat.com',
        password: passwordHash,
        role: 'admin',
        village: 'Bengaluru',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        preferredLanguage: 'en',
        profilePic: '🛡️',
      },
    ]);

    const farmer1 = users[0];
    const expert1 = users[1];
    const farmer2 = users[2];
    const admin1 = users[3];

    console.log('📝 Creating sample agricultural posts...');
    const posts = await Post.insertMany([
      {
        title: '📢 2026 Kharif Season Minimum Support Price (MSP) Announced',
        content:
          'The Ministry of Agriculture has revised the Minimum Support Price (MSP) for Paddy, Ragi, and Maize for the upcoming Kharif season. Farmers are advised to register on the official portal before the deadline.',
        category: 'Govt Schemes',
        crop: 'Paddy / Maize',
        isAnnouncement: true,
        author: admin1._id,
        tags: ['MSP', 'GovernmentScheme', 'Kharif2026'],
        location: { village: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' },
        likes: [farmer1._id, farmer2._id, expert1._id],
      },
      {
        title: '🐛 Need Advice: Pink Bollworm Infestation on BT Cotton Crop',
        content:
          'Noticed severe rosette flowers and early boll damage in my 60-day cotton field in Gadag district. What is the recommended organic or bio-pesticide spray sequence?',
        category: 'Pest Control',
        crop: 'Cotton',
        isAnnouncement: false,
        author: farmer1._id,
        tags: ['Cotton', 'PestControl', 'GadagFarmers'],
        location: { village: 'Shirhatti', district: 'Gadag', state: 'Karnataka' },
        likes: [expert1._id],
      },
      {
        title: '💡 Scientific Guidance for Pink Bollworm Management',
        content:
          '1. Install 5 Pheromone traps per acre immediately to monitor moth activity.\n2. Spray Neem seed kernel extract (NSKE 5%) or Azadirachtin 1500 ppm at early infestation.\n3. If crossing ETL threshold, apply recommended bio-fungicides.',
        category: 'Crops',
        crop: 'Cotton',
        isAnnouncement: false,
        author: expert1._id,
        tags: ['AgriExpert', 'BollwormControl', 'CropHealth'],
        location: { village: 'Dharwad', district: 'Dharwad', state: 'Karnataka' },
        likes: [farmer1._id, farmer2._id],
      },
      {
        title: '🌧️ Heavy Rainfall Alert for Malnad & Coastal Karnataka',
        content:
          'IMD forecasts moderate to heavy monsoon showers across Uttara Kannada and Shimoga districts for the next 4 days. Please ensure proper drainage channels in Arecanut and Ginger fields.',
        category: 'Weather',
        crop: 'Arecanut',
        isAnnouncement: true,
        author: expert1._id,
        tags: ['WeatherAlert', 'Monsoon2026', 'Arecanut'],
        location: { village: 'Sirsi', district: 'Uttara Kannada', state: 'Karnataka' },
        likes: [farmer2._id],
      },
    ]);

    console.log('💬 Creating initial farmer interactions & comments...');
    await Comment.insertMany([
      {
        text: 'Thank you Dr. Sharma! I will install the pheromone traps this evening.',
        author: farmer1._id,
        postId: posts[2]._id,
      },
      {
        text: 'Where can we get certified organic traps in Gadag district?',
        author: farmer2._id,
        postId: posts[2]._id,
      },
    ]);

    console.log('✅ Demo database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedData();
