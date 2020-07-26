import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  creationDate: Date;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  creationDate: { type: Date, default: new Date(), required: true },
  lastLogin: Date,
});

export default mongoose.model<IUser>("User", userSchema);
