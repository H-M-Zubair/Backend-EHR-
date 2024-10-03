import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';  // Adjust the import path accordingly

export const getAuthenticatedUser = async (token: string): Promise<any> => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET as string) as jwt.JwtPayload;
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error('Unknown error');
        }
    }
}