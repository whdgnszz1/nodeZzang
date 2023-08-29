import express from "express";
import {
  createComment,
  deleteOneComment,
  getAllComments,
  getOneComment,
  updateOneComment,
} from "../controllers/comments";
const router = express.Router({ mergeParams: true });

// 댓글 작성
router.post("/", createComment);
// 댓글 조회
router.get("/", getAllComments);
router.get("/:commentId", getOneComment);
// 댓글 수정
router.put("/:commentId", updateOneComment);
// 댓글 삭제
router.delete("/:commentId", deleteOneComment);

export default router;
