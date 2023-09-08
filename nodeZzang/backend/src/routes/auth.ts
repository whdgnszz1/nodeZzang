import passport from "passport";
import { verifyToken } from "./../middlewares/auth";
import express from "express";
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
function issueToken(user: any) {
  const { userId, nickname } = user;
  return jwt.sign({ userId, nickname }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
}

// 응답 처리 함수
function sendTokenResponse(req: any, res: any) {
  if (req.user) {
    const token = issueToken(req.user);
    res.cookie("accessToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    });
    res.redirect(process.env.CLIENT_URL!);
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
