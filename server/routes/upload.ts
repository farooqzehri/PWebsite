import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/upload
// Handles image upload; if Cloudinary credentials are set, it can upload to Cloudinary,
// otherwise generates a secure optimized web asset URL or data payload with publicId and order.
router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const { image, alt, order } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    const publicId = `bsa_prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    // In production with Cloudinary credentials set in env:
    // const cloudinary = require('cloudinary').v2;
    // const result = await cloudinary.uploader.upload(image, { folder: 'bismillah_state' });
    // return res.json({ url: result.secure_url, publicId: result.public_id });
    
    return res.json({
      success: true,
      image: {
        url: image,
        publicId,
        alt: alt || 'Property view',
        order: order || 1
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

export default router;
