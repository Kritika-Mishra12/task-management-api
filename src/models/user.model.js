import mongoose from 'mongoose';
import validator from 'validator';
import { roles } from '../config/roles.js';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    phone: {
      type: String,
      trim: true,
      validate(value) {
        if (!value.match(/^\+?1?\d{9,15}$/)) {
          throw new Error('Phone number must be entered in the format: +999999999. Up to 15 digits allowed');
        }
      },
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    created_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'user'
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
