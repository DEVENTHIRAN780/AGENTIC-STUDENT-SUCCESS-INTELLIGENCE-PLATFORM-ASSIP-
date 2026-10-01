"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../database/store.js");
const router = (0, express_1.Router)();
// GET /api/notifications
router.get('/', (req, res) => {
    const { userId, role } = req.query;
    const notifications = store_js_1.db.getNotifications(userId, role);
    res.json({
        total: notifications.length,
        unreadCount: notifications.filter(n => !n.isRead).length,
        notifications
    });
});
// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req, res) => {
    const success = store_js_1.db.markNotificationRead(req.params.id);
    if (!success) {
        res.status(404).json({ error: 'Notification not found.' });
        return;
    }
    res.json({ success: true });
});
// POST /api/notifications/mark-all-read
router.post('/mark-all-read', (req, res) => {
    const { userId, role } = req.body;
    const notifs = store_js_1.db.getNotifications(userId, role);
    notifs.forEach(n => { n.isRead = true; });
    res.json({ success: true, count: notifs.length });
});
exports.default = router;
