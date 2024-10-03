import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const doctorLoginValidation = (req: Request, res: Response, next: NextFunction): void => {
    const schema= Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).alphanum()
    });
    const {error}=schema.validate(req.body);
    if(error){
        res.status(400).json({
            message: "Bad Request", 
            error: error.details[0].message
        });
    }else{
        next();
    }
}
