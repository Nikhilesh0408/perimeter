const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

// Register a new risk-team user
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('app_users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  // Hash the password
  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('app_users')
    .insert([{ name, email, password_hash }])
    .select('id, name, email, role, created_at');

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ user: data[0] });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data: user, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

module.exports = { register, login };