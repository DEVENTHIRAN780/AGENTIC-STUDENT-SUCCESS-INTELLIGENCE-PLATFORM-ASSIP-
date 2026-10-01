"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../database/store.js");
const router = (0, express_1.Router)();
// Simple CSV text line parser
function parseCSV(csvText) {
    const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2)
        return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row = {};
        headers.forEach((h, idx) => {
            row[h] = values[idx] || '';
        });
        rows.push(row);
    }
    return rows;
}
// POST /api/data-import/preview (Validate CSV string without committing)
router.post('/preview', (req, res) => {
    const { csvContent, dataType = 'students' } = req.body;
    if (!csvContent) {
        res.status(400).json({ error: 'csvContent is required.' });
        return;
    }
    const rows = parseCSV(csvContent);
    if (rows.length === 0) {
        res.status(400).json({ error: 'No valid rows found in provided CSV data.' });
        return;
    }
    const errors = [];
    const preview = rows.slice(0, 5);
    rows.forEach((row, idx) => {
        if (dataType === 'students') {
            if (!row['Name'] && !row['name'])
                errors.push(`Row ${idx + 1}: Missing Name`);
            if (!row['Email'] && !row['email'])
                errors.push(`Row ${idx + 1}: Missing Email`);
        }
    });
    res.json({
        totalRows: rows.length,
        validRows: rows.length - errors.length,
        preview,
        errors: errors.slice(0, 10),
        sampleHeaders: Object.keys(rows[0] || {})
    });
});
// POST /api/data-import/commit (Commit parsed records to database)
router.post('/commit', (req, res) => {
    const { csvContent, dataType = 'students' } = req.body;
    if (!csvContent) {
        res.status(400).json({ error: 'csvContent is required.' });
        return;
    }
    const rows = parseCSV(csvContent);
    const studentsToInsert = rows.map(r => ({
        name: r['Name'] || r['name'] || '',
        email: r['Email'] || r['email'] || '',
        department: (r['Department'] || r['department'] || 'CSE'),
        program: r['Program'] || r['program'] || 'B.Tech Engineering',
        semester: Number(r['Semester'] || r['semester'] || 1),
        gpa: Number(r['GPA'] || r['gpa'] || 7.5),
        attendancePct: Number(r['Attendance'] || r['attendance'] || 85)
    }));
    const result = store_js_1.db.importStudentsCSV(studentsToInsert);
    store_js_1.db.createAuditLog({
        userId: 'admin-1',
        userName: 'Institutional Administrator',
        userRole: 'admin',
        action: 'Batch CSV Ingestion',
        resource: `${dataType.toUpperCase()} Dataset`,
        result: result.errors.length > 0 ? 'warning' : 'success',
        details: `Ingested ${result.inserted} records from CSV. Encountered ${result.errors.length} validation exceptions.`,
        ipAddress: req.ip || '127.0.0.1'
    });
    res.json({
        success: true,
        insertedCount: result.inserted,
        totalAttempted: rows.length,
        errors: result.errors
    });
});
exports.default = router;
