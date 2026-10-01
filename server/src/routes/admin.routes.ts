import { Router, Request, Response } from 'express';
import { db } from '../database/store.js';

const router = Router();

// In-memory system settings
let systemSettings = {
  institutionName: 'Metropolitan Institute of Technology & Research (MITR)',
  academicYear: '2026-2027',
  currentSemester: 'Odd (Semesters 1, 3, 5, 7)',
  earlyWarningThresholds: {
    criticalAttendanceThresholdPct: 75,
    criticalGpaThreshold: 6.0,
    missingAssignmentAlertCount: 2,
    enableAutoStudyPlanDrafting: true,
    enableHumanInTheLoopApproval: true,
    advisorAutoEscalationDays: 5
  },
  aiPreferences: {
    defaultModel: 'GPT-4o / Claude 3.5 Sonnet / Enterprise Local Reasoning',
    activeProvider: 'Mock AI Engine (Enterprise Verified)',
    confidenceThreshold: 85,
    contextWindowSize: 'Large (Full Academic Profile)'
  },
  security: {
    jwtExpiryDays: 7,
    mfaMandatoryForAdvisors: true,
    sessionTimeoutMinutes: 60,
    ipWhitelistingEnabled: false
  }
};

// GET /api/admin/audit-logs
router.get('/audit-logs', (_req: Request, res: Response): void => {
  const logs = db.getAuditLogs();
  res.json({
    total: logs.length,
    logs
  });
});

// GET /api/admin/settings
router.get('/settings', (_req: Request, res: Response): void => {
  res.json({ settings: systemSettings });
});

// PATCH /api/admin/settings
router.patch('/settings', (req: Request, res: Response): void => {
  const updates = req.body;
  systemSettings = {
    ...systemSettings,
    ...updates,
    earlyWarningThresholds: {
      ...systemSettings.earlyWarningThresholds,
      ...(updates.earlyWarningThresholds || {})
    },
    aiPreferences: {
      ...systemSettings.aiPreferences,
      ...(updates.aiPreferences || {})
    }
  };

  db.createAuditLog({
    userId: 'admin-1',
    userName: 'Dr. Meenakshi Sundaram',
    userRole: 'admin',
    action: 'Update System Configuration',
    resource: 'Institutional System Settings',
    result: 'success',
    details: 'Updated risk threshold calibrations and AI orchestration preferences.',
    ipAddress: req.ip || '127.0.0.1'
  });

  res.json({ success: true, settings: systemSettings });
});

export default router;
