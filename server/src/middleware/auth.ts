import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/index.js';
import { db } from '../database/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'assip-enterprise-jwt-secret-key-2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
    studentId?: string;
  };
}

export function generateToken(payload: { id: string; email: string; role: UserRole; name: string; studentId?: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no token provided in request, check demo fallback header or pass through for demo
    const demoRole = req.headers['x-demo-role'] as UserRole;
    if (demoRole) {
      const demoUser = db.users.find(u => u.role === demoRole) || db.users[0];
      req.user = {
        id: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
        name: demoUser.name,
        studentId: demoUser.studentId
      };
      return next();
    }
    res.status(401).json({ error: 'Authentication token required.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: `Forbidden: Access requires one of [${allowedRoles.join(', ')}]. Current role: ${req.user.role}` 
      });
      return;
    }
    next();
  };
}
