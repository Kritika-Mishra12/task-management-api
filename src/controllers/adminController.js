
import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt';

//create User
export const createUser = async (req, res, next) => {
  try {
    const { userName, firstName, lastName, email, password, phone } = req.body;

    if (!email || !password || !userName) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      userName,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: 'user',
      created_by: req.user._id
    });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully by admin' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Get single user
export const getUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};