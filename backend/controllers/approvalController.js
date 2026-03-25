import * as approvalService from '../services/approvalService.js';
import ErrorResponse from '../utils/errorResponse.js';

export const processApproval = async (req, res, next) => {
  try {
    const { action, reason } = req.body;
    if (!action) {
      return next(new ErrorResponse('Please provide an action (approved, rejected, conditional)', 400));
    }
    if (action === 'rejected' && !reason) {
      return next(new ErrorResponse('Please provide a reason for rejection', 400));
    }

    const approval = await approvalService.processApproval(req.params.requestId, req.body, req.user);
    res.status(201).json({ success: true, data: approval, message: `Request successfully ${action}` });
  } catch (error) {
    next(error);
  }
};

export const getApprovals = async (req, res, next) => {
  try {
    const approvals = await approvalService.getApprovalsForRequest(req.params.requestId);
    res.status(200).json({ success: true, count: approvals.length, data: approvals });
  } catch (error) {
    next(error);
  }
};
