import { Router, Request, Response } from 'express';
import { db } from '../database/store.js';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Demo accounts dictionary
const DEMO_USERS = [
  { email: 'student@demo.com', role: 'student', name: 'Alex Kumar', studentId: 'ST2024-1001' },
  { email: 'faculty@demo.com', role: 'faculty', name: 'Dr. Sunita Ramanathan' },
  { email: 'advisor@demo.com', role: 'advisor', name: 'Prof. Rajeshwar Kulkarni' },
  { email: 'admin@demo.com', role: 'admin', name: 'Dr. Meenakshi Sundaram' },
];

// POST /api/auth/login
router.post('/login', (req: Request, res: Response): void => {
  const { email, password, rememberMe } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }

  // Find user in db
  let user = db.findUserByEmail(email);

  // If not found in custom users, check demo users
  if (!user) {
    const demo = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (demo) {
      user = {
        id: `usr-${demo.role}-1`,
        email: demo.email,
        role: demo.role as any,
        name: demo.name,
        department: 'CSE',
        studentId: demo.studentId,
        createdAt: new Date().toISOString()
      };
      db.createUser(user);
    }
  }

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials. Try using one of the demo accounts.' });
    return;
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    studentId: user.studentId
  });

  // Log audit
  db.createAuditLog({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'User Authentication',
    resource: 'Auth Service',
    result: 'success',
    details: `User logged in with role ${user.role} (${rememberMe ? 'Remember me active' : 'Session'})`,
    ipAddress: req.ip || '127.0.0.1'
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar,
      department: user.department,
      studentId: user.studentId
    }
  });
});

// POST /api/auth/register
router.post('/register', (req: Request, res: Response): void => {
  const { name, email, password, role, department } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required.' });
    return;
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    res.status(409).json({ error: 'Account with this email already exists.' });
    return;
  }

  const assignedRole = role || 'student';
  const newUser = {
    id: `usr-${Date.now()}`,
    email,
    name,
    role: assignedRole,
    department: department || 'CSE',
    studentId: assignedRole === 'student' ? `ST2024-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
    createdAt: new Date().toISOString()
  };

  db.createUser(newUser);

  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name,
    studentId: newUser.studentId
  });

  res.status(201).json({
    token,
    user: newUser
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req: Request, res: Response): void => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }
  // Simulated password reset link
  res.json({
    message: `Password reset instructions have been dispatched to ${email}. Check your university inbox.`
  });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }
  const user = db.findUserById(req.user.id) || {
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    name: req.user.name,
    studentId: req.user.studentId,
    department: 'IT',
    createdAt: new Date().toISOString()
  };
  res.json({ user });
});

export default router;
