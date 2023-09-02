import { Request, Response, NextFunction } from "express";
import { LoginRequest, LoginResponse, SignUpRequest } from "../dtos/auth";
import UsersService from "../services/auth";
import jwt from "jsonwebtoken";
import asyncHandler from "../lib/asyncHandler";

export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: SignUpRequest = req.body;
    const result = await UsersService.signUp(user);
    console.log(result);
    res.send({ message: "회원 가입에 성공하였습니다." });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: LoginRequest = req.body;
    const loggedInUser: LoginResponse = await UsersService.login(user);
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign(loggedInUser, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(loggedInUser, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    res.setHeader("refreshToken", refreshToken);
    res.setHeader("accessToken", token);

    res.send({ Authorization: `Bearer ${token}` });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("Authorization");
    res.status(200).send({ message: "로그아웃에 성공하였습니다." });
  }
);
