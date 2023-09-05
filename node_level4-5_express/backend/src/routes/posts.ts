import express from "express";
import {
  createPost,
  deleteOnePost,
  getAllPosts,
  getOnePost,
  updateOnePost,
} from "../controllers/posts";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
const router = express.Router();

// 게시글 작성
router.post("/", ensureAuthenticated, createPost);
// 게시글 조회
router.get("/", getAllPosts);
router.get("/:postId", getOnePost);
// 게시글 수정
router.put("/:postId", ensureAuthenticated, updateOnePost);
// 게시글 삭제
router.delete("/:postId", ensureAuthenticated, deleteOnePost);

export default router;
