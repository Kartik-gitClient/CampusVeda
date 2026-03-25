import Request from '../models/Request.js';
import ErrorResponse from '../utils/errorResponse.js';

export const createRequest = async (requestData, userId) => {
  const request = await Request.create({
    ...requestData,
    requester: userId,
    history: [{ status: 'submitted', actor: userId, reason: 'Created request' }],
  });
  return request;
};

export const getRequests = async (user) => {
  let query = {};
  // Role-based filtering
  if (user.role === 'junior') {
    query.requester = user._id; // see own requests
  } else if (user.role === 'senior') {
    // Senior can see submitted or checking requests to approve
    query.status = { $in: ['submitted', 'checking', 'escalated', 'approved', 'rejected'] };
  }
  // HOD sees everything 
  
  const requests = await Request.find(query).populate('requester', 'name email department');
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
  return request;
};
