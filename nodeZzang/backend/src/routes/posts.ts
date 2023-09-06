import express from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

import PostsRepository from "../repositories/posts";
import PostsService from "../services/posts";
import PostsController from "../controllers/posts";
const postsRepository = new PostsRepository();
const postsService = new PostsService(postsRepository);
const postsController = new PostsController(postsService);

const router = express.Router();

// 게시글 작성
router.post("/", ensureAuthenticated, postsController.createPost);
// 게시글 조회
router.get("/", postsController.getAllPosts);
router.get("/:postId", postsController.getOnePost);
// 게시글 수정
router.put("/:postId", ensureAuthenticated, postsController.updateOnePost);
// 게시글 삭제
router.delete("/:postId", ensureAuthenticated, postsController.deleteOnePost);

export default router;
