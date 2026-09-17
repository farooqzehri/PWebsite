import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/inquiries (Admin)
router.get('/', requireAdmin, (req: Request, res: Response) => {
  res.json({ success: true, inquiries: db.getInquiries() });
});

// POST /api/inquiries (Public inquiry submission)
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone number are required' });
    }

    const inquiry = db.createInquiry(req.body);
    return res.status(201).json({ 
      success: true, 
      inquiry,
      message: 'Thank you. Your inquiry has been received. Our team will contact you shortly.'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/inquiries/:id/status
router.patch('/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['new', 'contacted', 'closed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid inquiry status' });
  }
  const updated = db.updateInquiryStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ success: false, message: 'Inquiry not found' });
  res.json({ success: true, inquiry: updated });
});

// DELETE /api/inquiries/:id
router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  const ok = db.deleteInquiry(req.params.id);
  if (!ok) return res.status(404).json({ success: false, message: 'Inquiry not found' });
  res.json({ success: true, message: 'Inquiry deleted' });
});

export default router;
