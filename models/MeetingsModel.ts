import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMeeting extends Document {
  patient: Schema.Types.ObjectId; 
  doctor: Schema.Types.ObjectId;  
  form: Schema.Types.ObjectId;    
  date: string;            
  time: string;            
  duration: string;               
}

const meetingSchema: Schema<IMeeting> = new Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, 
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'PatientForm', required: true },
    date: { type: String, required: true },  
    time: { type: String, required: true },  
    duration: { type: String, required: true },     
  },
  { timestamps: true }
);

const MeetingModel: Model<IMeeting> = mongoose.model<IMeeting>('Meeting', meetingSchema);
export default MeetingModel;
