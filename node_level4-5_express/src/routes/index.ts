import express from 'express';
import PostsRouter from './posts';
import CommentsRouter from './comments';
import UsersRouter from './auth';

const router = express.Router();

router.use("/posts", PostsRouter);
router.use("/posts/:postId/comments", CommentsRouter);
router.use("/users", UsersRouter);

export default router;
