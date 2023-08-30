import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/customError";

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      throw new CustomError("로그인이 필요한 기능입니다.", 403);
    }
    if (!process.env.JWT_SECRET) {
      throw new CustomError("process.env.JWT_SECRET를 찾을 수 없습니다.", 403);
    }
    const [tokenType, accessToken] = req.headers.authorization.split(" ")
    if(tokenType !== "Bearer") {
      throw new CustomError('전달된 쿠키에서 오류가 발생하였습니다.', 403)
    }
    res.locals.decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );
    return next();
  } catch (error: any) {
    if (error instanceof CustomError) {
      return res.status(error.status).send({ message: error.message });
    }

    if (error.name === "TokenExpiredError") {
      res
        .status(403)
        .send({ message: "전달된 쿠키에서 오류가 발생하였습니다." });
    }
    return res
      .status(403)
      .send({ message: "전달된 쿠키에서 오류가 발생하였습니다." });
  }
};
