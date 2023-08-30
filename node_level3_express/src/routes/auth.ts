import express from "express";
import { login, logout, signUp } from "../controllers/auth";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/auth";
const router = express.Router();

//회원가입
router.post("/signup", isNotLoggedIn, signUp);

//로그인
router.post("/login", isNotLoggedIn, login)

// 로그아웃
router.post('/logout', isLoggedIn, logout)

export default router;
