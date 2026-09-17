import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, categories: db.getCategories() });
});

router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const category = db.createCategory(req.body);
    res.status(201).json({ success: true, category });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, category: updated });
});

router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteCategory(req.params.id);
  if (!ok) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, message: 'Category deleted' });
});

export default router;
