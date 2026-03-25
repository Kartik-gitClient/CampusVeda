import Notification from '../models/Notification.js';

export const createNotification = async (userId, type, message, relatedId = null, relatedModel = null) => {
  const notification = await Notification.create({
    user: userId,
    type,
    message,
    relatedId,
    relatedModel,
  });
  return notification;
};

export const getUserNotifications = async (userId) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 });
};

export const markAsRead = async (id, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { isRead: true },
    { new: true }
  );
};
