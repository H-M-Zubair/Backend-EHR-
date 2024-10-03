import { Request, Response } from "express";
import DoctorModel, { IDoctor } from "../models/DoctorModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
export const registerDoctor = async (req: Request, res: Response) => {
  const doctorModel = new DoctorModel(req.body as Partial<IDoctor>);
  doctorModel.password = await bcrypt.hash(req.body.password, 10);

  try {
    const existingDoctor = await DoctorModel.findOne({ email: req.body.email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ message: "Doctor with this email already exists" });
    }
    const savedDoctor = await doctorModel.save();
    const { password, ...doctorWithoutPassword } = savedDoctor.toObject();
    return res.status(200).json({
      message: "Registration Successful",
      doctor: doctorWithoutPassword,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};

export const loginDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await DoctorModel.findOne({ email: req.body.email });
    if (!doctor) {
      return res
        .status(400)
        .json({ message: "Doctor with this email does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      doctor.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        email: doctor.email,
        userId: doctor._id,
      },
      process.env.SECRET as string,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });

    return res.status(200).json({ message: "Auth successful", doctor: doctor });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};

export const getAllUsersForDoctor = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Fetch all users from the User collection
    const users = await UserModel.find().select("-password"); // Exclude password for security

    return res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};

export const getSingleUserForDoctor = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Fetch a single user from the User collection
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logoutDoctor = (req: Request, res: Response): Response => {
  try {
    console.log("Received cookies:", req.cookies); // Check the cookies received
    const token = req.cookies["token"];

    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error); // Detailed error information
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

// export const getAuthenticatedDoctor = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         if (!req.cookies) {
//             return res.status(401).json({ message: "Cookies object is undefined" });
//         }

//         const token = req.cookies['token'];
//         if (!token) {
//             return res.status(400).json({ message: "Token is missing" });
//         }

//         const decoded = jwt.verify(token, process.env.SECRET as string) as jwt.JwtPayload;
//         const doctor = await DoctorModel.findById(decoded.userId);
//         if (!doctor) {
//             return res.status(401).json({ message: "Doctor not found" });
//         }

//         return res.status(200).json({
//             doctors: {

//                 email: doctor.email,

//             }
//         });
//     } catch (error) {
//         // Assert that error is of type Error
//         if (error instanceof Error) {
//             if (error.name === 'JsonWebTokenError') {
//                 return res.status(401).json({ message: "Invalid token" });
//             }
//             return res.status(500).json({ message: "Internal server error", error: error.message });
//         }

//         // In case error is not an instance of Error (rare case)
//         return res.status(500).json({ message: "Internal server error", error: "Unknown error" });
//     }}

export const getAuthenticatedDoctor = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Check if cookies are available
    if (!req.cookies || !req.cookies["token"]) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const token = req.cookies["token"];

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.SECRET as string
    ) as jwt.JwtPayload;

    // Fetch the doctor using the decoded userId
    const doctor = await DoctorModel.findById(decoded.userId);
    if (!doctor) {
      return res.status(401).json({ message: "Doctor not found" });
    }

    // Send a response with the doctor details
    return res.status(200).json({
      message: "Auth successful",
      doctor: {
        _id: doctor._id,
        email: doctor.email,
        createdAt: doctor.createdAt,
        __v: doctor.__v,
      },
    });
  } catch (error) {
    // Handle different types of errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", error: "unknown error" });
  }
};
