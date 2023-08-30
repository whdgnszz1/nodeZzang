import { Request, Response, NextFunction } from "express";
import { SignUpRequest } from "../dtos/auth";
import UsersService from "../services/auth";
import passport from "passport";

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

// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user: LoginRequest = req.body;
//     await UsersService.login(user);
//     return "로그인 완료, 토큰 발급";
//   } catch (error) {
//     next(error);
//   }
// };

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local", // localStrategy의 done(서버에러, 유저, 로직실패)
    (authError: string, user: Express.User, info: string) => {
      // 서버에러
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      // 로직 실패
      if (!user) {
        res.send({ message: info });
      }
      // 로그인 성공
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.send({ message: "로그인 성공" });
      });
    }
  )(req, res, next);
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.logOut(() => {
    res.send({ message: "로그아웃 성공" });
  });
};
