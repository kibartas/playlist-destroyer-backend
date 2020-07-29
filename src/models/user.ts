import mongoose from 'mongoose';
import { UserType } from '../../types/user';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50,
  },
  password: { type: String, required: true, maxlength: 60 },
  creationDate: { type: Date, default: new Date(), required: true },
  lastLogin: Date,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

export default mongoose.model<UserType>('User', userSchema);
