import * as analyticsService from '../services/analyticsService.js';

export const getOverview = async (req, res, next) => {
  try {
    const data = await analyticsService.getOverview();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getRequestsTrend = async (req, res, next) => {
  try {
    const data = await analyticsService.getRequestsTrend();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getConflictStats = async (req, res, next) => {
  try {
    const data = await analyticsService.getConflictAnalytics();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentUsage = async (req, res, next) => {
  try {
    const data = await analyticsService.getDepartmentUsage();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
