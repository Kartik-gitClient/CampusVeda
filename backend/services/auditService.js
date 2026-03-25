import AuditLog from '../models/AuditLog.js';

export const logAction = async (actorId, action, entity, entityId = null, beforeState = null, afterState = null) => {
  try {
    await AuditLog.create({
      actor: actorId,
      action,
      entity,
      entityId,
      beforeState,
      afterState,
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

export const getAuditLogs = async () => {
  return await AuditLog.find().populate('actor', 'name role').sort({ createdAt: -1 });
};
