import express from "express";
import { login, signUp } from "../controllers/users";
const router = express.Router();

//회원가입
router.post("/signup", signUp);

//로그인
router.post("/login", login);

export default router;
