require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const supabase = require('./config/supabaseClient');
const vendorRoutes = require('./routes/vendorRoutes');

// Test route - to confirm server is running
app.get('/', (req, res) => {
  res.json({ message: 'Perimeter backend is running!' });
});

app.get('/test-db', async (req, res) => {
  const { data, error } = await supabase.from('vendors').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ vendors: data });
});

// Vendor routes
app.use('/api/vendors', vendorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});