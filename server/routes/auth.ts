import { Router, Request, Response } from 'express';
import { db } from '../db/store';

const router = Router();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  // Check admin credentials
  const emailNorm = email.toLowerCase().trim();
  if (
    (emailNorm === 'admin@bismillahstateagency.com' || emailNorm === 'admin@bismillah.com' || emailNorm === 'admin') &&
    password === 'admin123'
  ) {
    const userPayload = {
      id: 'admin-1',
      name: 'Admin Bismillah State Agency',
      email: 'admin@bismillah.com',
      role: 'admin',
      phone: '+92 312 8001533'
    };
    const token = Buffer.from(JSON.stringify(userPayload)).toString('base64');
    return res.json({
      success: true,
      token,
      user: userPayload,
      message: 'Logged in successfully'
    });
  }

  // Check generic registered user
  const user = db.findUserByEmail(email);
  if (user && user.passwordHash === password) {
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };
    const token = Buffer.from(JSON.stringify(userPayload)).toString('base64');
    return res.json({
      success: true,
      token,
      user: userPayload,
      message: 'Logged in successfully'
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid email or password' });
});

// POST /api/auth/register
router.post('/register', (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists' });
  }

  const newUser = db.createUser({
    name,
    email,
    phone,
    role: role === 'property_owner' ? 'property_owner' : 'visitor',
    passwordHash: password
  });

  const userPayload = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    phone: newUser.phone
  };
  const token = Buffer.from(JSON.stringify(userPayload)).toString('base64');

  return res.status(201).json({
    success: true,
    token,
    user: userPayload,
    message: 'Registered successfully'
  });
});

// GET /api/auth/me
router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ success: true, user: null });
  }
  try {
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const user = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return res.json({ success: true, user });
  } catch {
    return res.json({ success: true, user: null });
  }
});

export default router;
