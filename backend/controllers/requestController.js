import { validationResult } from 'express-validator';
import * as requestService from '../services/requestService.js';
import ErrorResponse from '../utils/errorResponse.js';

export const createRequest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const request = await requestService.createRequest(req.body, req.user.id);
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const requests = await requestService.getRequests(req.user);
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

export const getRequest = async (req, res, next) => {
  try {
    const request = await requestService.getRequestById(req.params.id, req.user);
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const updateRequest = async (req, res, next) => {
  try {
    const request = await requestService.updateRequest(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const escalateRequest = async (req, res, next) => {
  try {
    const request = await requestService.escalateRequest(req.params.id, req.user);
    res.status(200).json({ success: true, data: request, message: 'Request escalated to HOD' });
  } catch (error) {
    next(error);
  }
};
