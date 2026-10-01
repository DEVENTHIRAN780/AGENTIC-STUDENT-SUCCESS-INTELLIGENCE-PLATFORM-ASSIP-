import { Router, Request, Response } from 'express';
import { db } from '../database/store.js';

const router = Router();

// Simple CSV text line parser
function parseCSV(csvText: string): Array<Record<string, string>> {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    rows.push(row);
  }

  return rows;
}

// POST /api/data-import/preview (Validate CSV string without committing)
router.post('/preview', (req: Request, res: Response): void => {
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

  const errors: string[] = [];
  const preview = rows.slice(0, 5);

  rows.forEach((row, idx) => {
    if (dataType === 'students') {
      if (!row['Name'] && !row['name']) errors.push(`Row ${idx + 1}: Missing Name`);
      if (!row['Email'] && !row['email']) errors.push(`Row ${idx + 1}: Missing Email`);
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
router.post('/commit', (req: Request, res: Response): void => {
  const { csvContent, dataType = 'students' } = req.body;

  if (!csvContent) {
    res.status(400).json({ error: 'csvContent is required.' });
    return;
  }

  const rows = parseCSV(csvContent);
  const studentsToInsert = rows.map(r => ({
    name: r['Name'] || r['name'] || '',
    email: r['Email'] || r['email'] || '',
    department: (r['Department'] || r['department'] || 'CSE') as any,
    program: r['Program'] || r['program'] || 'B.Tech Engineering',
    semester: Number(r['Semester'] || r['semester'] || 1),
    gpa: Number(r['GPA'] || r['gpa'] || 7.5),
    attendancePct: Number(r['Attendance'] || r['attendance'] || 85)
  }));

  const result = db.importStudentsCSV(studentsToInsert);

  db.createAuditLog({
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

export default router;
