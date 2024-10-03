import mongoose ,{ Document, Model, Schema } from 'mongoose';

export interface IDoctor extends Document {
    
    email: string;
    password: string;
    createdAt?: Date;
}
const DoctorSchema: Schema<IDoctor> = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
    const DoctorModel: Model<IDoctor> = mongoose.model('Doctor', DoctorSchema);
    export default DoctorModel