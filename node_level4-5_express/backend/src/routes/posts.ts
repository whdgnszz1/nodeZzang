import express from "express";
import {
  createPost,
  deleteOnePost,
  getAllPosts,
  getOnePost,
  updateOnePost,
} from "../controllers/posts";
import { verifyToken } from "../middlewares/auth";
const router = express.Router();

// 게시글 작성
router.post("/", verifyToken, createPost);
// 게시글 조회
router.get("/",verifyToken, getAllPosts);
router.get("/:postId", verifyToken, getOnePost);
// 게시글 수정
router.put("/:postId", verifyToken, updateOnePost);
// 게시글 삭제
router.delete("/:postId", verifyToken, deleteOnePost);

export default router;
