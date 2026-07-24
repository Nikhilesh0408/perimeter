const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

// Generates a simple random join code like "X7K9-QP2M"
const generateJoinCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing chars like 0/O, 1/I
  let code = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

// Register a new risk-team user, creating or joining an organization
const register = async (req, res) => {
  const { name, email, password, organizationName, joinCode, isNewOrganization } = req.body;

  if (!name || !email || !password || !organizationName) {
    return res.status(400).json({ error: 'Name, email, password, and organization name are required' });
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

  let org;

  if (isNewOrganization) {
    // Creating a brand new organization
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .ilike('name', organizationName)
      .single();

    if (existingOrg) {
      return res.status(409).json({
        error: 'An organization with this name already exists. Ask a colleague for the join code instead.',
      });
    }

    const newJoinCode = generateJoinCode();

    const { data: newOrg, error: orgError } = await supabase
      .from('organizations')
      .insert([{ name: organizationName, join_code: newJoinCode }])
      .select()
      .single();

    if (orgError) return res.status(500).json({ error: orgError.message });
    org = newOrg;
  } else {
    // Joining an existing organization - requires correct join code
    if (!joinCode) {
      return res.status(400).json({ error: 'Join code is required to join an existing organization' });
    }

    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('*')
      .ilike('name', organizationName)
      .single();

    if (!existingOrg) {
      return res.status(404).json({ error: 'No organization found with that name' });
    }

    if (existingOrg.join_code !== joinCode.toUpperCase()) {
      return res.status(403).json({ error: 'Incorrect join code' });
    }

    org = existingOrg;
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('app_users')
    .insert([{ name, email, password_hash, organization_id: org.id }])
    .select('id, name, email, role, organization_id, created_at');

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({
    user: data[0],
    organization: { id: org.id, name: org.name, join_code: org.join_code },
  });
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
    { id: user.id, email: user.email, role: user.role, organization_id: user.organization_id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id,
    },
  });
};

module.exports = { register, login };