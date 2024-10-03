// validation/userSchema.ts
import { z } from 'zod';

export const patientFormSchema = z.object({
  step1: z.object({
    name: z.string().min(1, "Your name is required"),
    country: z.string().nonempty("Country is required"),
    phone: z.string().min(1, "Phone number is required"),
    date: z.string().nonempty("Date is required"),
    time: z.string().nonempty("Time is required"),
    duration: z.string().nonempty("Duration is required"),
  }),
  step2: z.object({
    traumaHistory: z.string().optional(),
    dailyRoutine: z.string().optional(),
    reasonForVisit: z.string().optional(),
    surgicalHistory: z.string().optional(),
    familyMedicalHistory: z.string().optional(),
    currentPainLevel: z.number().min(1).max(10).optional(),
    sleepPatterns: z.string().optional(),
    stressLevels: z.number().min(1).max(10).optional(),
  }),
  step3: z.object({
    clientDateOfBirth: z.string().nonempty("Date of Birth is required"),
    clientAddress: z.string().optional(),
    familyMedicalHistory: z.object({
      hasDiabetes: z.boolean().optional(),
      hasHeartDisease: z.boolean().optional(),
      hasCancer: z.boolean().optional(),
      familyMemberDetails: z.string().optional(),
    }),
    recentHealthChecks: z.object({
      lastPhysicalExamDate: z.string().optional(),
      cholesterolLevels: z.string().optional(),
      bloodPressure: z.string().optional(),
    }),
    mentalHealth: z.object({
      anxiety: z.boolean().optional(),
      depression: z.boolean().optional(),
      recentStressors: z.string().optional(),
    }),
    goals: z.string().optional(),
    concerns: z.string().optional(),
  }),
});

// TypeScript type inference
export type PatientFormInput = z.infer<typeof patientFormSchema>;
