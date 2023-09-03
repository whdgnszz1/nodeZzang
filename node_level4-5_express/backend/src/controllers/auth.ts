import { Request, Response, NextFunction } from "express";
import { LoginRequest, LoginResponse, SignUpRequest } from "../dtos/auth";
import UsersService from "../services/auth";
import jwt from "jsonwebtoken";
import asyncHandler from "../lib/asyncHandler";

export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { nickname, password, confirm } = req.body;
    if (!nickname || !password || !confirm) {
      return res
        .status(400)
        .send({ message: "요청한 데이터 형식이 올바르지 않습니다." });
    }

    const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
    if (!nicknameRegex.test(nickname)) {
      return res
        .status(412)
        .send({ message: "닉네임의 형식이 일치하지 않습니다." });
    }

    if (password.length < 4) {
      return res
        .status(412)
        .send({ message: "패스워드 형식이 일치하지 않습니다." });
    }

    if (password.includes(nickname)) {
      return res
        .status(412)
        .send({ message: "패스워드에 닉네임이 포함되어 있습니다." });
    }

    const user: SignUpRequest = req.body;
    const result = await UsersService.signUp(user);
    res.status(200).send({ message: "회원 가입에 성공하였습니다." });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { nickname, password } = req.body;
    if (!nickname || !password) {
      return res.status(400).send({ message: "로그인에 실패하였습니다." });
    }

    const user: LoginRequest = req.body;
    const loggedInUser: LoginResponse = await UsersService.login(user);
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT 토큰을 찾을 수 없습니다.");
    }

    const accessToken = jwt.sign(loggedInUser, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      {
        userId: loggedInUser.userId,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("accessToken", accessToken, { httpOnly: false });
    res.cookie("refreshToken", refreshToken, { httpOnly: false });
    res.status(200).send({ token: accessToken, refreshToken });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken");
    res.status(200).send({ message: "로그아웃에 성공하였습니다." });
  }
);
