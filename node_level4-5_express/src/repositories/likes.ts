import { UserLikedPostsResponse } from "../dtos/likes";
import prisma from "../utils/prisma/index";

class LikesRepository {
  toggleLikePost = async (user: Express.User, postId: number) => {
    const userId: number = user.userId;
    const isExistLike = await prisma.likes.findFirst({
      where: { userId: userId, postId: postId },
    });

    if (isExistLike) {
      await prisma.$transaction([
        prisma.likes.delete({
          where: {
            userId_postId: {
              userId: userId,
              postId: postId,
            },
          },
        }),
        prisma.posts.update({
          where: { postId: postId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        }),
      ]);
      return { message: "게시글의 좋아요를 취소하였습니다." };
    } else {
      await prisma.$transaction([
        prisma.likes.create({ data: { userId, postId } }),
        prisma.posts.update({
          where: { postId: postId },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        }),
      ]);
      return { message: "게시글의 좋아요를 등록하였습니다." };
    }
  };

  getUserLikedPosts = async (user: Express.User) => {
    const userId: number = user.userId;

    const userLikedPostsResult: { postId: number }[] =
      await prisma.likes.findMany({
        where: { userId: userId },
        select: { postId: true },
      });
    const userLikedPostIds: number[] = userLikedPostsResult.map(
      (like) => like.postId
    );

    const rawLikedPosts = await prisma.posts.findMany({
      where: { postId: { in: userLikedPostIds } },
      select: {
        postId: true,
        userId: true,
        nickname: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        likeCount: true,
      },
    });

    const userLikedPosts: UserLikedPostsResponse[] = rawLikedPosts.map(
      ({ likeCount, ...rest }) => ({
        ...rest,
        likes: likeCount,
      })
    );

    return userLikedPosts;
  };
}

export default new LikesRepository();
