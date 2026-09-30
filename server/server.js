const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🌱 AgriChat Backend Server is running smoothly!',
    timestamp: new Date().toISOString(),
  });
});

// Basic Root Route
app.get('/', (req, res) => {
  res.send('Welcome to AgriChat API - Empowering Farmers Together');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 AgriChat Server running on port ${PORT}`);
});
