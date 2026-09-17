import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, testimonials: db.getTestimonials() });
});

router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const item = db.createTestimonial(req.body);
    res.status(201).json({ success: true, testimonial: item });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateTestimonial(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  res.json({ success: true, testimonial: updated });
});

router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteTestimonial(req.params.id);
  if (!ok) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  res.json({ success: true, message: 'Testimonial deleted' });
});

export default router;
