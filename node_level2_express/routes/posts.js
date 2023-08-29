import express from "express";
import {
  createPost,
  deleteOnePost,
  getAllPosts,
  getOnePost,
  updateOnePost,
} from "../controllers/posts.js";
const router = express.Router();

// 게시글 작성
router.post("/", createPost);
// 게시글 조회
router.get("/:postId", getOnePost);
router.get("/", getAllPosts);
// 게시글 수정
router.get("/:postId", updateOnePost);
// 게시글 삭제
router.get("/:postId", deleteOnePost);

export default router;
