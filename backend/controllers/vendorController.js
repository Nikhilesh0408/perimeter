const supabase = require('../config/supabaseClient');

// Add a new vendor
const addVendor = async (req, res) => {
  const { name, industry, years_in_business, employee_count } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Vendor name is required' });
  }

  const { data, error } = await supabase
    .from('vendors')
    .insert([{ name, industry, years_in_business, employee_count }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ vendor: data[0] });
};

// Get all vendors
const getVendors = async (req, res) => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('onboarded_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ vendors: data });
};

module.exports = { addVendor, getVendors };