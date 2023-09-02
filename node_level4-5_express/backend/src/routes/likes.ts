import express from 'express'
import { getUserLikedPosts, togglePostLike } from '../controllers/likes'
import { verifyToken } from '../middlewares/auth'
const router = express.Router({mergeParams: true})

router.post('/:postId/like',verifyToken, togglePostLike)
router.get('/like',verifyToken, getUserLikedPosts)

export default router