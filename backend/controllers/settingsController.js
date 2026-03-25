import Settings from '../models/Settings.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ department: 'global' });
    if (!settings) {
      settings = await Settings.create({ department: 'global' });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { department: 'global' },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
