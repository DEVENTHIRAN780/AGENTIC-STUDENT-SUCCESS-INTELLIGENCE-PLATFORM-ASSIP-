"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const students_routes_js_1 = __importDefault(require("./routes/students.routes.js"));
const interventions_routes_js_1 = __importDefault(require("./routes/interventions.routes.js"));
const courses_routes_js_1 = __importDefault(require("./routes/courses.routes.js"));
const analytics_routes_js_1 = __importDefault(require("./routes/analytics.routes.js"));
const ai_routes_js_1 = __importDefault(require("./routes/ai.routes.js"));
const study_plans_routes_js_1 = __importDefault(require("./routes/study-plans.routes.js"));
const goals_routes_js_1 = __importDefault(require("./routes/goals.routes.js"));
const notifications_routes_js_1 = __importDefault(require("./routes/notifications.routes.js"));
const data_import_routes_js_1 = __importDefault(require("./routes/data-import.routes.js"));
const admin_routes_js_1 = __importDefault(require("./routes/admin.routes.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security and CORS configuration
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
}));
// Body parser
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health Check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'healthy',
        platform: 'Agentic Student Success Intelligence Platform (ASSIP)',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// Register API Routes
app.use('/api/auth', auth_routes_js_1.default);
app.use('/api/students', students_routes_js_1.default);
app.use('/api/interventions', interventions_routes_js_1.default);
app.use('/api/courses', courses_routes_js_1.default);
app.use('/api/analytics', analytics_routes_js_1.default);
app.use('/api/ai', ai_routes_js_1.default);
app.use('/api/study-plans', study_plans_routes_js_1.default);
app.use('/api/goals', goals_routes_js_1.default);
app.use('/api/notifications', notifications_routes_js_1.default);
app.use('/api/data-import', data_import_routes_js_1.default);
app.use('/api/admin', admin_routes_js_1.default);
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const clientDistPath = fs_1.default.existsSync(path_1.default.resolve(process.cwd(), '../client/dist'))
    ? path_1.default.resolve(process.cwd(), '../client/dist')
    : path_1.default.resolve(process.cwd(), 'client/dist');
// Serve static frontend assets if built
if (fs_1.default.existsSync(clientDistPath)) {
    app.use(express_1.default.static(clientDistPath));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path_1.default.join(clientDistPath, 'index.html'));
    });
}
// 404 Handler for API
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message || 'An unexpected error occurred in the intelligence engine.'
    });
});
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` ASSIP Backend Server active on http://localhost:${PORT}`);
    console.log(` AI Multi-Agent Orchestrator Ready`);
    console.log(`=======================================================`);
});
exports.default = app;
