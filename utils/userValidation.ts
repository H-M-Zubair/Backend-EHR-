import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const userRegisterValidation = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).alphanum(),
        address: Joi.string().required(),
        phone: Joi.string().required().min(10).max(14),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        
        res.status(400).json({
            message: "Bad Request",
            error: error.details[0].message
        });
    } else {
      
        next();
    }
};

const userLoginValidation = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).alphanum(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({
            message: "Bad Request",
            error: error.details[0].message
        });
    } else {
        next();
    }
};

export { userRegisterValidation, userLoginValidation };
