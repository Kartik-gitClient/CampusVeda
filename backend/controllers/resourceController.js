import * as resourceService from '../services/resourceService.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getResources = async (req, res, next) => {
  try {
    const resources = await resourceService.getResources(req.query);
    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

export const getResource = async (req, res, next) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

export const createResource = async (req, res, next) => {
  try {
    const resource = await resourceService.createResource(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  try {
    const resource = await resourceService.updateResource(req.params.id, req.body);
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    await resourceService.deleteResource(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
