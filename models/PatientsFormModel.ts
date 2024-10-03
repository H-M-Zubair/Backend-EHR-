import mongoose from "mongoose";

const patientFormSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User reference
  step1: {
    name: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
  },
  step2: {
    traumaHistory: { type: String },
    dailyRoutine: { type: String },
    reasonForVisit: { type: String },
    surgicalHistory: { type: String },
    familyMedicalHistory: { type: String },
    currentPainLevel: { type: Number, min: 1, max: 10 },
    sleepPatterns: { type: String },
    stressLevels: { type: Number, min: 1, max: 10 },
  },
  step3: {
    clientDateOfBirth: { type: String, required: true },
    clientAddress: { type: String },
    familyMedicalHistory: {
      hasDiabetes: { type: Boolean },
      hasHeartDisease: { type: Boolean },
      hasCancer: { type: Boolean },
      familyMemberDetails: { type: String },
    },
    recentHealthChecks: {
      lastPhysicalExamDate: { type: String },
      cholesterolLevels: { type: String },
      bloodPressure: { type: String },
    },
    mentalHealth: {
      anxiety: { type: Boolean },
      depression: { type: Boolean },
      recentStressors: { type: String },
    },
    goals: { type: String },
    concerns: { type: String },
  },
}, { timestamps: true });

export const PatientForm = mongoose.model("PatientForm", patientFormSchema);
