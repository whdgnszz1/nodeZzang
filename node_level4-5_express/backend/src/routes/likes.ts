import { ensureAuthenticated } from "./../middlewares/ensureAuthenticated";
import express from "express";
const router = express.Router({ mergeParams: true });

import LikesController from "../controllers/likes";
import LikesService from "../services/likes";
import LikesRepository from "../repositories/likes";
import PostsRepository from "../repositories/posts";

const postsRepository = new PostsRepository();
const likesRepository = new LikesRepository(postsRepository);
const likesService = new LikesService(likesRepository);
const likesController = new LikesController(likesService);

router.post(
  "/:postId/like",
  ensureAuthenticated,
  likesController.togglePostLike
);
router.get("/like", ensureAuthenticated, likesController.getUserLikedPosts);

export default router;
