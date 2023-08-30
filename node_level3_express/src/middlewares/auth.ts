import { NextFunction, Request, Response } from "express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    // passport 통해서 로그인 했는지?
    next();
  } else {
    res.status(403).send("로그인이 필요한 기능입니다.");
  }
};

export const isNotLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("이미 로그인한 상태입니다.");
  }
};
