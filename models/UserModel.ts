import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the User interface that extends mongoose Document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  // Mongoose automatically adds createdAt and updatedAt when using timestamps
}

// Define the schema
const UserSchema: Schema<IUser> = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
}, { timestamps: true });  // Automatically add createdAt and updatedAt

// No need to explicitly add IUser for model creation as TypeScript can infer
const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
