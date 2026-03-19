const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes Configuration
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ideas', require('./routes/idea'));

app.get('/', (req, res) => {
  res.send('Startup Idea Validator API is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
