import express from "express";
import { login, logout, signUp } from "../controllers/auth";
const router = express.Router();

//회원가입
router.post("/signup", signUp);

//로그인
router.post("/login", login);

// 로그아웃
router.post("/logout", logout);

export default router;
