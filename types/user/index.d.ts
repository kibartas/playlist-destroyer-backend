import { Document } from 'mongoose';

export type UserRoles = 'admin' | 'user' | undefined;

export interface IUser {
  readonly username: string;
  readonly password: string;
  readonly creationDate?: Date;
  readonly lastLogin?: Date;
  role?: UserRoles;
}

export type UserType = IUser & Document;
