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

export const createResource = async (data) => {
  return await Resource.create(data);
};

export const updateResource = async (id, data) => {
  const resource = await Resource.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!resource) throw new ErrorResponse('Resource not found', 404);
  return resource;
};

export const deleteResource = async (id) => {
  const resource = await Resource.findById(id);
  if (!resource) throw new ErrorResponse('Resource not found', 404);
  
  resource.isActive = false;
  await resource.save();
  return {};
};
