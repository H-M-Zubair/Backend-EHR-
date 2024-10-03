// import mongoose, { Document, Model, Schema } from 'mongoose';

// export interface IUserDoctor extends Document {
//     userId: Schema.Types.ObjectId;
//     doctorId: Schema.Types.ObjectId;
// }

// const UserDoctorSchema: Schema<IUserDoctor> = new Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     doctorId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Doctor',
//         required: true
//     }
// });
// const UserDoctorModel: Model<IUserDoctor> = mongoose.model<IUserDoctor>('UserDoctor', UserDoctorSchema);
// export default UserDoctorModel;