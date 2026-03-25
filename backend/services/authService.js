import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const registerUser = async (userData) => {
  const { name, email, password, role, phone, whatsappNumber, department, designation } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ErrorResponse('User already exists', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    whatsappNumber,
    department,
    designation,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
    token: generateToken(user._id),
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new ErrorResponse('Account has been deactivated', 403);
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
    token: generateToken(user._id),
  };
};
