const supabase = require('../config/supabaseClient');
const axios = require('axios');

// Add a new vendor
const addVendor = async (req, res) => {
  const {
    name,
    industry,
    years_in_business,
    employee_count,
    roa_c,
    operating_gross_margin,
    current_ratio,
    quick_ratio,
    debt_ratio,
    net_income_to_total_assets,
    working_capital_to_total_assets,
  } = req.body;
  const organization_id = req.user.organization_id;

  if (!name) {
    return res.status(400).json({ error: 'Vendor name is required' });
  }

  let risk_score = null;
  let risk_tier = null;

  // Only attempt scoring if financial inputs were provided
  const hasFinancialData = roa_c !== undefined && operating_gross_margin !== undefined;

  if (hasFinancialData) {
    try {
      const scoreResponse = await axios.post('http://127.0.0.1:8000/score', {
        roa_c,
        operating_gross_margin,
        current_ratio,
        quick_ratio,
        debt_ratio,
        net_income_to_total_assets,
        working_capital_to_total_assets,
      });

      risk_score = scoreResponse.data.risk_score;
      risk_tier = scoreResponse.data.risk_tier;
    } catch (scoreError) {
      console.error('ML scoring failed, continuing without a score:', scoreError.message);
      // We deliberately continue without a score rather than failing the whole request
    }
  }

  const { data, error } = await supabase
    .from('vendors')
    .insert([{
      name,
      industry,
      years_in_business,
      employee_count,
      organization_id,
      risk_score,
      risk_tier,
    }])
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