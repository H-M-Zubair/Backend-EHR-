import { Request, Response } from 'express';
import { getAuthenticatedUser } from '../utils/authenticatedUser';
import { PatientForm } from '../models/PatientsFormModel';
import { patientFormSchema } from '../utils/patientFormSchema';
import UserModel from '../models/UserModel';
export const storeFormData = async (req: Request, res: Response) => {
   
    try {
        if (!req.cookies) {
            return res.status(401).json({ message: "Cookies object is undefined" });
        }

        const token = req.cookies['token'];
        if (!token) {
            return res.status(400).json({ message: "Token is missing" });
        }
        const user = await getAuthenticatedUser(token);
        const validatedData = patientFormSchema.parse(req.body);
        const patientForm = new PatientForm({
            ...validatedData,
            userId: user._id,  
        });
        await patientForm.save();  
        return res.status(201).json({ message: 'Form data saved successfully', patientForm });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json({ error: 'An error occurred', details: error.message });
        } else {
            return res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

// export const getPatientFormsByUserId = async (req: Request, res: Response): Promise<Response> => {

//   try {
//     console.log('Getting patient', req)
//       const userId = req.params.userId; // Get the userId from request params
//       const user = await UserModel.findById(userId);
//       if (!user) {
//           return res.status(404).json({ message: "User not found" });
//       }
//       const patientForms = await PatientForm.find({ userId }).populate('userId', 'firstName lastName email'); // Populate user details if needed
//       return res.status(200).json({
//           message: "Patient forms fetched successfully",
//           patientForms,
//       });
//   } catch (error) {
//       return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
//   }
// };

export const getUserAndPatientForms = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.id; // Assume we get the userId from the route params

    // Fetch the user by userId
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const patientForms = await PatientForm.find({ userId }).populate('userId', 'firstName lastName email');

    // Return both user and patient forms
    return res.status(200).json({
      message: "User and patient forms fetched successfully",
      user,
      patientForms,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
  }
};


export const getFormByFormId=async(req:Request,res:Response)=>{
  try {
    const formId=req.params.id;
    
    const patientForm=await PatientForm.findById(formId);
    if(!patientForm){
      return res.status(404).json({message:"Patient form not found"});
    }
    return res.status(200).json({message:"Patient form fetched successfully",patientForm});
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
  }
}

export const updateFormByFormId=async(req:Request,res:Response)=>{
console.log("Requested patient form",req.params.id,req.body)
    try {
        const patientForm = await PatientForm.findById(req.params.id);
        if (!patientForm) {
            return res.status(404).json({ message: "Patient form not found" });
        }
       patientForm.set(req.body);
        await patientForm.save();
        console.log("update Form By FormId ",patientForm)
        return res.status(200).json({ message: "Patient form updated successfully", patientForm });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}

export const deleteForm = async (req: Request, res: Response) => {
  try {
    const formId = req.params.id;
    const result = await PatientForm.deleteOne({ _id: formId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Patient form not found" });
    }
    return res.status(200).json({ message: "Patient form deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
  }
};


export const getAllForms=async(req:Request,res:Response)=>{
  try {
const forms=await PatientForm.find();
console.log(forms)
if (!forms || forms.length === 0) {
  return res.status(404).json({ message: 'No forms found' });
}
return res.status(200).json({ message: 'Forms retrieved successfully', forms });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: 'An error occurred', details: error.message });
  } else {
      return res.status(500).json({ error: 'An unknown error occurred' });
  }
  }
}