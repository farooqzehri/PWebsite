import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, settings: db.getSettings() });
});

router.put('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated, message: 'Settings updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
