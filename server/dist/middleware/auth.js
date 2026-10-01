"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store_js_1 = require("../database/store.js");
const JWT_SECRET = process.env.JWT_SECRET || 'assip-enterprise-jwt-secret-key-2026';
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // If no token provided in request, check demo fallback header or pass through for demo
        const demoRole = req.headers['x-demo-role'];
        if (demoRole) {
            const demoUser = store_js_1.db.users.find(u => u.role === demoRole) || store_js_1.db.users[0];
            req.user = {
                id: demoUser.id,
                email: demoUser.email,
                role: demoUser.role,
                name: demoUser.name,
                studentId: demoUser.studentId
            };
            return next();
        }
        res.status(401).json({ error: 'Authentication token required.' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid or expired authentication token.' });
    }
}
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized.' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: `Forbidden: Access requires one of [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
            });
            return;
        }
        next();
    };
}
