import Request from '../models/Request.js';
import Resource from '../models/Resource.js';
import ErrorResponse from '../utils/errorResponse.js';
import { logAction } from './auditService.js';

export const createRequest = async (requestData, userId) => {
  // Look up resource to get ID and department
  const resource = await Resource.findOne({ 
    name: requestData.resourceName, 
    type: requestData.type,
    isActive: true 
  });

  const request = await Request.create({
    ...requestData,
    requester: userId,
    resourceId: resource?._id,
    department: resource?.department || 'General',
    history: [{ status: 'submitted', actor: userId, reason: 'Created request' }],
  });

  await logAction(userId, 'create', 'Request', request._id, null, request);
  
  return request;
};

export const getRequests = async (user) => {
  let query = {};
  // Role-based filtering
  if (user.role === 'junior') {
    query.requester = user._id; // see own requests only
  } else if (user.role === 'senior') {
    // Senior sees all non-draft requests across all users
    query.status = { $ne: 'draft' };
  }
  // HOD sees everything (query stays empty)

  const requests = await Request.find(query)
    .populate('requester', 'name email department designation')
    .sort({ createdAt: -1 });
  return requests;
};

export const getRequestById = async (id, user) => {
  const request = await Request.findById(id).populate('requester', 'name email department');
  if (!request) {
    throw new ErrorResponse(`Request not found with id of ${id}`, 404);
  }

  if (user.role === 'junior' && request.requester._id.toString() !== user._id.toString()) {
    throw new ErrorResponse('Not authorized to access this request', 403);
  }

  return request;
};

export const updateRequest = async (id, updateData, user) => {
  let request = await Request.findById(id);
  if (!request) {
    throw new ErrorResponse(`Request not found with id of ${id}`, 404);
  }

  if (user.role === 'junior' && request.requester.toString() !== user._id.toString()) {
    throw new ErrorResponse('Not authorized to update this request', 403);
  }

  if (request.status !== 'draft' && request.status !== 'submitted') {
    throw new ErrorResponse('Cannot update a request that is already processed', 400);
  }

  request = await Request.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  return request;
};

export const escalateRequest = async (id, user) => {
  let request = await Request.findById(id);
  if (!request) {
    throw new ErrorResponse(`Request not found with id of ${id}`, 404);
  }

  if (['submitted', 'checking'].includes(request.status) === false) {
    throw new ErrorResponse('Only submitted or checking requests can be escalated', 400);
  }

  request.status = 'escalated';
  request.history.push({
    status: 'escalated',
    actor: user._id,
    reason: 'Manually escalated by faculty',
  });

  await request.save();
  await logAction(user._id, 'escalate', 'Request', request._id, null, request);
  return request;
};
