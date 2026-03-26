import Resource from '../models/Resource.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getResources = async (query) => {
  return await Resource.find(query);
};

export const getResourceById = async (id) => {
  const resource = await Resource.findById(id);
  if (!resource) throw new ErrorResponse('Resource not found', 404);
  return resource;
};

export const createResource = async (data, user) => {
  if (user.role === 'hod' && data.department !== user.department) {
    throw new ErrorResponse('Not authorized to create resources for other departments', 403);
  }
  return await Resource.create(data);
};

export const updateResource = async (id, data, user) => {
  const resource = await Resource.findById(id);
  if (!resource) throw new ErrorResponse('Resource not found', 404);
  
  if (user.role === 'hod' && resource.department !== user.department) {
    const updateFields = Object.keys(data);
    const isOnlyStatus = updateFields.length === 1 && updateFields[0] === 'status';
    
    if (resource.type !== 'Room' || !isOnlyStatus) {
      throw new ErrorResponse('HODs can only update the status of rooms in other departments', 403);
    }
  }

  Object.assign(resource, data);
  return await resource.save();
};

export const deleteResource = async (id, user) => {
  const resource = await Resource.findById(id);
  if (!resource) throw new ErrorResponse('Resource not found', 404);
  
  if (user.role === 'hod' && resource.department !== user.department) {
    throw new ErrorResponse('Not authorized to delete resources from other departments', 403);
  }

  resource.isActive = false;
  await resource.save();
  return {};
};
