import express from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

import PostsRepository from "../repositories/posts";
import CommentsRepository from "../repositories/comments";
import CommentsService from "../services/comments";
import CommentsController from "../controllers/comments";
const postsRepository = new PostsRepository();
const commentsRepository = new CommentsRepository(postsRepository);
const commentsService = new CommentsService(commentsRepository);
const commentsController = new CommentsController(commentsService);

const router = express.Router({ mergeParams: true });

// 댓글 작성
router.post("/", ensureAuthenticated, commentsController.createComment);
// 댓글 조회
router.get("/", commentsController.getAllComments);
// 댓글 수정
router.put("/:commentId", ensureAuthenticated, commentsController.updateOneComment);
// 댓글 삭제
router.delete("/:commentId", ensureAuthenticated, commentsController.deleteOneComment);

export default router;
