import mongoose, { Document } from 'mongoose';

export type UserRoles = 'admin' | 'user' | undefined;

export interface IUser {
  readonly username: string;
  readonly password: string;
  readonly creationDate?: Date;
  readonly lastLogin?: Date;
  role?: UserRoles;
}

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

export type UserType = IUser & Document;

export default mongoose.model<UserType>('User', userSchema);
