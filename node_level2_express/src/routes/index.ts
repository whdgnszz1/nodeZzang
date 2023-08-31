import express from "express";
import PostsRouter from "./posts";
import CommentsRouter from "./comments";

const router = express.Router();

router.use("/posts", [PostsRouter]);
router.use("/posts/:postId/comments", [CommentsRouter]);

export default router;
