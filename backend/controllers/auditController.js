import * as auditService from '../services/auditService.js';

export const getSystemAuditLogs = async (req, res, next) => {
  try {
    const logs = await auditService.getAuditLogs();
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};
