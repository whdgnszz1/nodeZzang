import { DecodedToken, LoginResponse } from './../dtos/auth';
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/customError";

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      throw new CustomError(403, "로그인이 필요한 기능입니다.");
    }
    if (!process.env.JWT_SECRET) {
      throw new CustomError(403, "process.env.JWT_SECRET를 찾을 수 없습니다.");
    }

    const [tokenType, accessToken] = req.headers.authorization.split(" ");
    if (tokenType !== "Bearer") {
      throw new CustomError(403, "전달된 쿠키에서 오류가 발생하였습니다.");
    }
   
    res.locals.decoded = jwt.verify(accessToken, process.env.JWT_SECRET) as DecodedToken;
    return next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res
        .status(403)
        .send({ message: "전달된 쿠키에서 오류가 발생하였습니다." });
    }
    next(error)
  }
};
