import { Router, Request, Response } from 'express';
import { db } from '../database/store.js';

const router = Router();

// GET /api/notifications
router.get('/', (req: Request, res: Response): void => {
  const { userId, role } = req.query;
  const notifications = db.getNotifications(userId as string, role as string);
  res.json({
    total: notifications.length,
    unreadCount: notifications.filter(n => !n.isRead).length,
    notifications
  });
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req: Request, res: Response): void => {
  const success = db.markNotificationRead(req.params.id as string);
  if (!success) {
    res.status(404).json({ error: 'Notification not found.' });
    return;
  }
  res.json({ success: true });
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', (req: Request, res: Response): void => {
  const { userId, role } = req.body;
  const notifs = db.getNotifications(userId, role);
  notifs.forEach(n => { n.isRead = true; });
  res.json({ success: true, count: notifs.length });
});

export default router;
