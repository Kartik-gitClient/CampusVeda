import * as requestService from '../services/requestService.js';
import * as conflictService from '../services/conflictService.js';
import * as notificationService from '../services/notificationService.js';
import * as aiService from '../services/aiService.js';
import ErrorResponse from '../utils/errorResponse.js';

export const createRequest = async (req, res, next) => {
  try {
    const { type, resourceName, purpose, startDate, endDate } = req.body;
    if (!type || !resourceName || !purpose || !startDate || !endDate) {
      return next(new ErrorResponse('type, resourceName, purpose, startDate and endDate are required', 400));
    }

    const request = await requestService.createRequest(req.body, req.user.id);

    // Auto-run conflict detection after creating
    const conflicts = await conflictService.detectConflicts(request._id);

    // Notify requester if conflicts were found
    if (conflicts && conflicts.length > 0) {
      await notificationService.createNotification(
        req.user.id, 'conflict_detected',
        `A conflict was detected on your ${resourceName} request.`,
        request._id, 'Request'
      );
    }

    res.status(201).json({
      success: true,
      data: request,
      conflicts: conflicts?.length || 0,
      message: conflicts?.length
        ? `Request submitted with ${conflicts.length} conflict(s) detected.`
        : 'Request submitted successfully.',
    });
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

    // Notify HOD about escalation
    const { default: User } = await import('../models/User.js');
    const hods = await User.find({ role: 'hod', isActive: true });
    for (const hod of hods) {
      await notificationService.createNotification(
        hod._id, 'escalation_needed',
        `A request for ${request.resourceName} has been escalated and needs your review.`,
        request._id, 'Request'
      );
    }

    res.status(200).json({ success: true, data: request, message: 'Request escalated to HOD' });
  } catch (error) {
    next(error);
  }
};

export const generateDocument = async (req, res, next) => {
  try {
    const documentBody = await aiService.generateResourceDocument(req.body);
    res.status(200).json({ success: true, document: documentBody });
  } catch (error) {
    next(error);
  }
};

export const emailDocument = async (req, res, next) => {
  try {
    const { document, toEmail } = req.body;
    if (!document || !toEmail) {
      return next(new ErrorResponse('Document content and toEmail are required', 400));
    }
    
    // In a production environment, you would use nodemailer here:
    // const nodemailer = await import('nodemailer');
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ to: toEmail, subject: 'Resource Request Document', text: document });
    
    console.log(`[Email Service] Sent document to ${toEmail}`);
    
    res.status(200).json({ success: true, message: `Document successfully emailed to ${toEmail}` });
  } catch (error) {
    next(error);
  }
};
