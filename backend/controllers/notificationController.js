import * as notificationService from '../services/notificationService.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    if (!notification) {
       return next(new ErrorResponse(`Notification not found`, 404));
    }
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};
