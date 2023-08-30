import express from "express";
import {
  createPost,
  deleteOnePost,
  getAllPosts,
  getOnePost,
  updateOnePost,
} from "../controllers/posts";
import { isLoggedIn } from "../middlewares/auth";
const router = express.Router();

// 게시글 작성
router.post("/", isLoggedIn, createPost);
// 게시글 조회
router.get("/", getAllPosts);
router.get("/:postId", getOnePost);
// 게시글 수정
router.put("/:postId", isLoggedIn, updateOnePost);
// 게시글 삭제
router.delete("/:postId", isLoggedIn, deleteOnePost);

export default router;
