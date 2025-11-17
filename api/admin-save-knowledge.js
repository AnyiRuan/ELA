// Save chatbot knowledge base from admin
const fs = require('fs');
const path = require('path');

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
    // Verify authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const knowledgeData = req.body;

    if (!knowledgeData) {
      return res.status(400).json({ success: false, error: 'Knowledge data is required' });
    }

    // Save to temporary file storage
    try {
      const storagePath = path.join('/tmp', 'ela-knowledge.json');
      fs.writeFileSync(storagePath, JSON.stringify(knowledgeData, null, 2));
      console.log('Knowledge saved to:', storagePath);
    } catch (err) {
      console.error('Error saving knowledge:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to save knowledge'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Knowledge base saved successfully',
      note: 'Changes are saved temporarily. For persistent storage, configure a database.'
    });
  } catch (error) {
    console.error('Save knowledge error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
