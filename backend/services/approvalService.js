import Approval from '../models/Approval.js';
import Request from '../models/Request.js';
import Conflict from '../models/Conflict.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import { createNotification } from '../services/notificationService.js';
import { logAction } from './auditService.js';

export const processApproval = async (requestId, approvalData, user) => {
  const request = await Request.findById(requestId).populate('requester', 'name email');
  if (!request) {
    throw new ErrorResponse('Request not found', 404);
  }

  // Check unresolved conflicts
  const activeConflicts = await Conflict.find({ request: requestId, status: 'active' });
  if (activeConflicts.length > 0 && approvalData.action === 'approved') {
    const hasMajor = activeConflicts.some(c => c.severity === 'major');
    if (hasMajor && user.role !== 'hod') {
      throw new ErrorResponse('Cannot approve: request has an active major conflict. HOD resolution required.', 403);
    }
  }

  const approval = await Approval.create({
    request: requestId,
    approver: user._id,
    action: approvalData.action,
    reason: approvalData.reason,
    conditions: approvalData.conditions,
  });

  // Update request status
  request.status = approvalData.action;
  request.history.push({
    status: approvalData.action,
    actor: user._id,
    reason: approvalData.reason || `Request ${approvalData.action} by ${user.name}`,
  });
  await request.save();

  // Notify the original requester about the decision
  if (request.requester) {
    const notifType = approvalData.action === 'approved' ? 'request_approved' : 'request_rejected';
    const notifMsg = approvalData.action === 'approved'
      ? `Your request for "${request.resourceName}" has been approved! 🎉`
      : `Your request for "${request.resourceName}" was rejected. Reason: ${approvalData.reason || 'No reason provided.'}`;

    await createNotification(request.requester._id, notifType, notifMsg, request._id, 'Request');
  }

  await logAction(user._id, `process_${approvalData.action}`, 'Approval', approval._id, null, approval);

  return approval;
};

export const getApprovalsForRequest = async (requestId) => {
  return await Approval.find({ request: requestId }).populate('approver', 'name role department');
};
