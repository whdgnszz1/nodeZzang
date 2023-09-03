import { DecodedToken } from "./../dtos/auth";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/customError";
import UsersRepositoty from "../repositories/auth";

export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
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
      try {
        const refreshToken = req.cookies.refreshToken;
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as DecodedToken;

        const user = await UsersRepositoty.getUser(decodedRefreshToken.userId);
        if (!user) {
          throw new CustomError(403, "전달된 쿠키에서 오류가 발생하였습니다.");
        }

        const newAccessToken = jwt.sign(
          { user },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );

        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        res.locals.decoded = jwt.verify(newAccessToken, process.env.JWT_SECRET as string) as DecodedToken;
        return next();
      } catch (innerError) {
        next(innerError);
      }
    } else {
      next(error);
    }
  }
}
