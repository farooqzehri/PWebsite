import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/properties
router.get('/', (req: Request, res: Response) => {
  try {
    const result = db.getProperties(req.query);
    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching properties' });
  }
});

// GET /api/properties/:slugOrId
router.get('/:identifier', (req: Request, res: Response) => {
  try {
    const property = db.getPropertyBySlugOrId(req.params.identifier);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    const related = db.getRelatedProperties(property, 3);
    return res.json({ success: true, property, related });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching property' });
  }
});

// POST /api/properties (Admin or submit-property)
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, price, purpose, propertyType, area, address, city } = req.body;
    if (!title || !price || !purpose || !propertyType) {
      return res.status(400).json({ success: false, message: 'Title, price, purpose, and property type are required' });
    }

    const newProperty = db.createProperty(req.body);
    return res.status(201).json({ success: true, property: newProperty, message: 'Property created successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error creating property' });
  }
});

// PUT /api/properties/:id
router.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateProperty(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    return res.json({ success: true, property: updated, message: 'Property updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error updating property' });
  }
});

// DELETE /api/properties/:id
router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const deleted = db.deleteProperty(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    return res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error deleting property' });
  }
});

// PATCH /api/properties/:id/featured
router.patch('/:id/featured', requireAdmin, (req: Request, res: Response) => {
  try {
    const property = db.getPropertyBySlugOrId(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    const updated = db.updateProperty(property._id, { featured: !property.featured });
    return res.json({ success: true, property: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/properties/:id/status
router.patch('/:id/status', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['available', 'sold', 'rented'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const updated = db.updateProperty(req.params.id, { status });
    if (!updated) return res.status(404).json({ success: false, message: 'Property not found' });
    return res.json({ success: true, property: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
