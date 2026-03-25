import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    // Only allow users to update their own profile, or HOD can update anyone
    if (user._id.toString() !== req.user.id && req.user.role !== 'hod') {
      return next(new ErrorResponse(`Not authorized to update user`, 403));
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    if (req.user.role !== 'hod') {
      return next(new ErrorResponse(`Not authorized to deactivate user`, 403));
    }

    user.isActive = false;
    await user.save();
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
