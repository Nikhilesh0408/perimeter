const supabase = require('../config/supabaseClient');

// Add a new vendor
const addVendor = async (req, res) => {
  const { name, industry, years_in_business, employee_count } = req.body;
  const organization_id = req.user.organization_id;

  if (!name) {
    return res.status(400).json({ error: 'Vendor name is required' });
  }

  const { data, error } = await supabase
    .from('vendors')
    .insert([{ name, industry, years_in_business, employee_count, organization_id }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ vendor: data[0] });
};

// Get all vendors for the logged-in user's organization
const getVendors = async (req, res) => {
  const organization_id = req.user.organization_id;

  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('organization_id', organization_id)
    .order('onboarded_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ vendors: data });
};

module.exports = { addVendor, getVendors };