import Approval from '../models/Approval.js';
import Request from '../models/Request.js';
import Conflict from '../models/Conflict.js';
import ErrorResponse from '../utils/errorResponse.js';

export const processApproval = async (requestId, approvalData, user) => {
  const request = await Request.findById(requestId);
  if (!request) {
    throw new ErrorResponse('Request not found', 404);
  }

  // Check unresolved conflicts
  const activeConflicts = await Conflict.find({ request: requestId, status: 'active' });
  if (activeConflicts.length > 0 && approvalData.action === 'approved') {
    // If major conflict, only HOD can approve
    const hasMajor = activeConflicts.some(c => c.severity === 'major');
    if (hasMajor && user.role !== 'hod') {
      throw new ErrorResponse('Cannot approve request with active major conflicts. HOD resolution required.', 403);
    }
  }

  const approval = await Approval.create({
    request: requestId,
    approver: user._id,
    action: approvalData.action,
    reason: approvalData.reason,
    conditions: approvalData.conditions,
  });

  request.status = approvalData.action; 
  request.history.push({
    status: approvalData.action,
    actor: user._id,
    reason: approvalData.reason || `Request ${approvalData.action}`,
  });

  await request.save();
  return approval;
};

export const getApprovalsForRequest = async (requestId) => {
  return await Approval.find({ request: requestId }).populate('approver', 'name role department');
};
