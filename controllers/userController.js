import mongoose from 'mongoose';
import User from '../models/User.js';

const publicUser = (user) => ({
  _id: user._id,
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
});

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, message: 'Users fetched successfully', data: users.map(publicUser) });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, status } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password and role are required' });
    }

    const user = await User.create({ name, email: email.toLowerCase(), password, phone, role, status: status || 'active' });
    res.status(201).json({ success: true, message: 'User created successfully', data: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, email, password, phone, role, status } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.toLowerCase();
    if (password) user.password = password;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;
    if (status !== undefined) user.status = status;
    await user.save();

    res.json({ success: true, message: 'User updated successfully', data: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    if (id === req.user.userId) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });
    }

    const user = await User.findByIdAndUpdate(id, { status: 'inactive' }, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'User deactivated successfully', data: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export default { getUsers, createUser, updateUser, deactivateUser };
