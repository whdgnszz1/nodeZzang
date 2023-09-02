import express from 'express';
import PostsRouter from './posts';
import CommentsRouter from './comments';
import UsersRouter from './auth';
import LikesRouter from './likes'

const router = express.Router();

router.use('/posts', LikesRouter )
router.use("/posts/:postId/comments", CommentsRouter);
router.use("/posts", PostsRouter);
router.use("/", UsersRouter);

export default router;
