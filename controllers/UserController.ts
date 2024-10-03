import { NextFunction, Request, Response, } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import UserModel, { IUser } from '../models/UserModel';

interface CustomRequest extends Request {
    user: any; // or IUser if you have a specific user interface
  }

const jwtVerify = promisify(jwt.verify);

// Register User
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    const userModel = new UserModel(req.body as Partial<IUser>);
    userModel.password = await bcrypt.hash(req.body.password, 10);

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Save the new user
        const savedUser = await userModel.save();

        // Convert Mongoose document to plain object and exclude password
        const { password, ...userWithoutPassword } = savedUser.toObject();

        return res.status(201).json({ message: "Registration Successful", user: userWithoutPassword });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(401).json({ message: "Login failed: Invalid username or password" });
        }

        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Login failed: Invalid password" });
        }

        const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.SECRET as string,
            { expiresIn: "1h" }
        );

        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV !== 'production',
            sameSite: 'lax',
            maxAge: 3600000
        });

        return res.status(200).json({
            message: "Auth successful",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: (error as Error).message });
    }
};

// Get Authenticated User
export const getAuthenticatedUser = async (req: Request, res: Response): Promise<Response> => {

    try {

        if (!req.cookies) {
            return res.status(401).json({ message: "Cookies object is undefined" });
        }

        const token = req.cookies['token'];
        if (!token) {
            return res.status(400).json({ message: "Token is missing" });
        }

        const decoded = jwt.verify(token, process.env.SECRET as string) as jwt.JwtPayload;
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (error) {
       
        if (error instanceof Error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: "Invalid token" });
            }
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    
        // In case error is not an instance of Error (rare case)
        return res.status(500).json({ message: "Internal server error", error: "Unknown error" });
    }}

export const logoutUser = (req: Request, res: Response): Response => {
    try {
      console.log('Received cookies:', req.cookies); // Check the cookies received
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
      console.error('Logout Error:', error); // Detailed error information
      return res.status(500).json({ message: "Internal server error", error: (error as Error).message });
    }
  };
  

// Get All Users
export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users = await UserModel.find();
        return res.status(200).json({ message: "Users fetched successfully", users });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
};

// export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {

//     console.log(req)
//     try {
//       const token = req.cookies['token'];  
//       if (!token) {
//         return res.status(401).json({ message: 'Authentication token is missing' });
//       }
  
    
//       const decoded = jwt.verify(token, process.env.SECRET as string) as jwt.JwtPayload;
  
      
//       const user = await UserModel.findById(decoded.userId);
//       if (!user) {
//         return res.status(401).json({ message: 'User not found' });
//       }
  
//       req.user = user;  // Attach user to the request object
//       next();  // Proceed to the next middleware or route handler
//     } catch (error) {
//       return res.status(401).json({ message: 'Invalid or expired token' });
//     }
//   };

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(user);
        return res.status(200).json({ message: "User fetched successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }}
