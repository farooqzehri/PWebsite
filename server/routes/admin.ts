import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/admin/stats
router.get('/stats', requireAdmin, (req: Request, res: Response) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
