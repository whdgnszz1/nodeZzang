import express from "express";
import {
  createComment,
  deleteOneComment,
  getAllComments,
  getOneComment,
  updateOneComment,
} from "../controllers/comments";
import { isLoggedIn } from "../middlewares/auth";
const router = express.Router({ mergeParams: true });

// 댓글 작성
router.post("/", isLoggedIn, createComment);
// 댓글 조회
router.get("/", getAllComments);
router.get("/:commentId", getOneComment);
// 댓글 수정
router.put("/:commentId", isLoggedIn, updateOneComment);
// 댓글 삭제
router.delete("/:commentId", isLoggedIn, deleteOneComment);

export default router;
