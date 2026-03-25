import * as conflictService from '../services/conflictService.js';

export const getConflicts = async (req, res, next) => {
  try {
    const conflicts = await conflictService.getConflicts();
    res.status(200).json({ success: true, count: conflicts.length, data: conflicts });
  } catch (error) {
    next(error);
  }
};

export const resolveConflict = async (req, res, next) => {
  try {
    const conflict = await conflictService.resolveConflict(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: conflict });
  } catch (error) {
    next(error);
  }
};
