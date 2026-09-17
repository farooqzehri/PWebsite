import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, locations: db.getLocations() });
});

router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const location = db.createLocation(req.body);
    res.status(201).json({ success: true, location });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateLocation(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Location not found' });
  res.json({ success: true, location: updated });
});

router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteLocation(req.params.id);
  if (!ok) return res.status(404).json({ success: false, message: 'Location not found' });
  res.json({ success: true, message: 'Location deleted' });
});

export default router;
