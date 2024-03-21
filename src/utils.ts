import bcrypt from "bcrypt";
import passport from "passport";
import { Request, Response, NextFunction } from 'express';

export const passportCall = (strategy: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(strategy, function (err: any, user: any, _info: any) {
      if (err) return next(err);
      if (!user) {

        next();
      }else{
        req.user = user;
        next();
      }
      
    })(req, res, next);
  };
};

export const createHash = (password: string) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user: any, password: string) =>
  bcrypt.compareSync(password, user.password);
