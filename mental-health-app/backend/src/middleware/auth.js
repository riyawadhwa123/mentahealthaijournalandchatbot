const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('[auth.js] Request received:');
  console.log('  - Authorization header:', authHeader ? '✓ present' : '✗ missing');
  console.log('  - Full header value:', authHeader || 'undefined');
  console.log('  - JWT_SECRET available:', !!process.env.JWT_SECRET);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[auth.js] ✗ Auth failed: No valid Bearer token');
    return res.status(401).json({ error: 'No token, authorization denied.' });
  }
  
  const token = authHeader.replace('Bearer ', '');
  console.log('[auth.js] Token extracted, length:', token.length);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[auth.js] ✓ Token verified successfully, userId:', decoded.userId);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    console.log('[auth.js] ✗ Token verification failed:', err.message);
    console.log('[auth.js] Error type:', err.name);
    return res.status(401).json({ error: 'Token is not valid. ' + err.message });
  }
}

module.exports = auth; 