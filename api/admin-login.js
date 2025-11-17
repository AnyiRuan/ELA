// Admin login API
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required' });
    }

    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || 'ela2024admin';

    // Simple password verification
    if (password === adminPassword) {
      // Generate a simple token (in production, use JWT or similar)
      const token = Buffer.from(`${password}:${Date.now()}`).toString('base64');

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
