import { ensureAuthenticated } from "./../middlewares/ensureAuthenticated";
import express from "express";
import { getUserLikedPosts, togglePostLike } from "../controllers/likes";
const router = express.Router({ mergeParams: true });

router.post("/:postId/like", ensureAuthenticated, togglePostLike);
router.get("/like", ensureAuthenticated, getUserLikedPosts);

export default router;
