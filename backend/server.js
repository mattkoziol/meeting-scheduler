require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL  // You'll set this in Render.com
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mongoose model
const availabilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  availability: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now }
});
const Availability = mongoose.model('Availability', availabilitySchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// POST /api/availability
app.post('/api/availability', async (req, res) => {
  try {
    const { name, email, availability } = req.body;
    if (!name || !availability || !Array.isArray(availability)) {
      return res.status(400).json({ error: 'Name and availability are required.' });
    }
    const entry = new Availability({ name, email, availability });
    await entry.save();
    res.status(201).json({ message: 'Availability submitted.' });
  } catch (err) {
    console.error('Error saving availability:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/availability
app.get('/api/availability', async (req, res) => {
  try {
    const all = await Availability.find();
    const summary = {};
    all.forEach(entry => {
      entry.availability.forEach(slot => {
        summary[slot] = (summary[slot] || 0) + 1;
      });
    });
    res.json({ all, summary });
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/best-time
app.get('/api/best-time', async (req, res) => {
  try {
    const all = await Availability.find();
    const slotCounts = {};
    all.forEach(entry => {
      entry.availability.forEach(slot => {
        slotCounts[slot] = (slotCounts[slot] || 0) + 1;
      });
    });
    let max = 0;
    let bestSlots = [];
    for (const [slot, count] of Object.entries(slotCounts)) {
      if (count > max) {
        max = count;
        bestSlots = [slot];
      } else if (count === max) {
        bestSlots.push(slot);
      }
    }
    res.json({ bestSlots, max, totalUsers: all.length });
  } catch (err) {
    console.error('Error finding best time:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/availability (clear all data)
app.delete('/api/availability', async (req, res) => {
  try {
    await Availability.deleteMany({});
    res.json({ message: 'All data cleared successfully.' });
  } catch (err) {
    console.error('Error clearing data:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
