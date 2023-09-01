import express from "express";
import PostsRouter from "./posts";
import CommentsRouter from "./comments";
import AuthRouter from "./auth";

const router = express.Router();

router.use("/posts", [PostsRouter]);
router.use("/posts/:postId/comments", [CommentsRouter]);
router.use("/", [AuthRouter]);

export default router;
