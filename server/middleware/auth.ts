import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  try {
    // Simple robust token decoding
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (decoded && (decoded.role === 'admin' || decoded.email === 'admin@bismillahstateagency.com')) {
      req.user = decoded;
      return next();
    }
    return res.status(403).json({ success: false, message: 'Admin privileges required' });
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid authentication token' });
  }
}
