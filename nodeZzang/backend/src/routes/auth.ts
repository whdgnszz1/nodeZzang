import passport from "passport";
import { verifyToken } from "./../middlewares/auth";
import express from "express";
import { login, logout, signUp, editProfile } from "../controllers/auth";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { imageUpload } from "../middlewares/imageUpload";
const router = express.Router();

// 회원가입
router.post("/signup", signUp);

//로그인
router.post("/login", login);

//카카오
router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const kakaoLoggedInToken = req.user?.kakaoLoggedInToken;
    if (kakaoLoggedInToken) {
      res.cookie("accessToken", kakaoLoggedInToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1일
      });
      res.redirect(process.env.REDIRECT_URL!);
    } else {
      res.status(401).send('Unauthorized');
    }
  }
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
