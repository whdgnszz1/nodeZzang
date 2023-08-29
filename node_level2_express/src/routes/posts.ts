import express from "express";
import {
  createPost,
  deleteOnePost,
  getAllPosts,
  getOnePost,
  updateOnePost,
} from "../controllers/posts";
const router = express.Router();

// 게시글 작성
router.post("/", createPost);
// 게시글 조회
router.get("/", getAllPosts);
router.get("/:postId", getOnePost);
// 게시글 수정
router.get("/:postId", updateOnePost);
// 게시글 삭제
router.get("/:postId", deleteOnePost);

export default router;
