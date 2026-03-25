import Request from '../models/Request.js';
import Conflict from '../models/Conflict.js';
import User from '../models/User.js';

export const getOverview = async () => {
  const [totalRequests, pendingRequests, approvedRequests, totalConflicts, totalUsers] = await Promise.all([
    Request.countDocuments(),
    Request.countDocuments({ status: { $in: ['submitted', 'checking'] } }),
    Request.countDocuments({ status: 'approved' }),
    Conflict.countDocuments({ status: 'active' }),
    User.countDocuments({ isActive: true }),
  ]);

  return { totalRequests, pendingRequests, approvedRequests, totalConflicts, totalUsers };
};

export const getRequestsTrend = async () => {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const trend = await Request.aggregate([
    { $match: { createdAt: { $gte: last7Days } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', count: 1, _id: 0 } },
  ]);

  return trend;
};

export const getConflictAnalytics = async () => {
  const bySeverity = await Conflict.aggregate([
    { $group: { _id: '$severity', count: { $sum: 1 } } },
    { $project: { severity: '$_id', count: 1, _id: 0 } },
  ]);

  const byType = await Conflict.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $project: { type: '$_id', count: 1, _id: 0 } },
  ]);

  return { bySeverity, byType };
};

export const getDepartmentUsage = async () => {
  return await Request.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'requester',
        foreignField: '_id',
        as: 'requesterData',
      },
    },
    { $unwind: '$requesterData' },
    {
      $group: {
        _id: '$requesterData.department',
        count: { $sum: 1 },
      },
    },
    { $project: { department: '$_id', count: 1, _id: 0 } },
    { $sort: { count: -1 } },
  ]);
};
