import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import jwt from 'jsonwebtoken';
import { logAction } from './auditService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  designation: user.designation,
});

export const registerUser = async (body) => {
  const { name, email, password, role, phone, whatsappNumber, department, designation } = body;

  if (!name || !email || !password) {
    throw new ErrorResponse('Name, email, and password are required', 400);
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    throw new ErrorResponse('Email already registered', 400);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'junior',
    phone,
    whatsappNumber,
    department,
    designation,
  });

  await logAction(user._id, 'register', 'User', user._id, null, formatUser(user));

  return {
    user: formatUser(user),
    token: generateToken(user._id),
  };
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new ErrorResponse('Email and password are required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
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
    user: formatUser(user),
    token: generateToken(user._id),
  };
};
