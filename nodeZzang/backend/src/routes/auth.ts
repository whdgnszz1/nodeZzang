import passport from "passport";
import { verifyToken } from "./../middlewares/auth";
import express, { Request, Response } from "express";
import { login, logout, signUp, editProfile } from "../controllers/auth";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { imageUpload } from "../middlewares/imageUpload";
import jwt from "jsonwebtoken";

const router = express.Router();

// 회원가입
router.post("/signup", signUp);

// 로그인
router.post("/login", login);

/* 소셜로그인 시 토큰 발급 */
// 토큰 발급 함수
function issueToken(user: Express.User) {
  const { userId, nickname, profileUrl } = user;
  return jwt.sign({ userId, nickname, profileUrl }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
}

// 응답 처리 함수
function sendTokenResponse(req: Request, res: Response) {
  if (req.user) {
    const { userId, nickname, profileUrl } = req.user;
    const token = issueToken(req.user);

    res.cookie("accessToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    });

    const redirectUrl = `${process.env
      .CLIENT_URL!}?userId=${userId}&nickname=${encodeURIComponent(
      nickname
    )}&profileUrl=${encodeURIComponent(profileUrl || '')}`;
    res.redirect(redirectUrl);
  } else {
    res.status(401).send("Unauthorized");
  }
}

/* 카카오 로그인 */
router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/login",
    session: false,
  }),
  sendTokenResponse
);

/* 구글 로그인 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  sendTokenResponse
);

// 로그아웃
router.post("/logout", logout);

// 프로필 수정
router.put(
  "/profile",
  verifyToken,
  ensureAuthenticated,
  imageUpload,
  editProfile
);

export default router;
