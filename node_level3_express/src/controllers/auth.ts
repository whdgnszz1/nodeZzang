import { Request, Response, NextFunction } from "express";
import { LoginRequest, SignUpRequest } from "../dtos/auth";
import UsersService from "../services/auth";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: SignUpRequest = req.body;
    const result = await UsersService.signUp(user);
    console.log(result);
    res.send({ message: "회원 가입에 성공하였습니다." });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: LoginRequest = req.body;
    await UsersService.login(user);
    return "로그인 완료, 토큰 발급";
  } catch (error) {
    next(error);
  }
};

export const logout = async () => {}

