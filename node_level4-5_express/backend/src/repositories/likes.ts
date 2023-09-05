import PostsRepository from "./posts";
import { CustomError } from "../errors/customError";
import prisma from "../utils/prisma/index";
import { PostResponse } from "../dtos/posts";

class LikesRepository {
  constructor(private readonly postsRepository: PostsRepository) {}

  private addLike = async (userId: number, postId: number) => {
    await prisma.$transaction([
      prisma.likes.create({ data: { userId, postId } }),
      prisma.posts.update({
        where: { postId },
        data: {
          likeCount: { increment: 1 },
        },
      }),
    ]);
  };

  private removeLike = async (userId: number, postId: number) => {
    await prisma.$transaction([
      prisma.likes.delete({
        where: { userId_postId: { userId, postId } },
      }),
      prisma.posts.update({
        where: { postId },
        data: {
          likeCount: { decrement: 1 },
        },
      }),
    ]);
  };

  toggleLikePost = async (user: Express.User, postId: number) => {
    const post = await this.postsRepository.getPostById(postId);

    if (!post) {
      throw new CustomError(404, "해당하는 게시글을 찾을 수 없습니다.");
    }

    const existingLike = await prisma.likes.findFirst({
      where: { userId: user.userId, postId },
    });

    if (existingLike) {
      await this.removeLike(user.userId, postId);
      return { message: "게시글의 좋아요를 취소하였습니다." };
    } else {
      await this.addLike(user.userId, postId);
      return { message: "게시글의 좋아요를 등록하였습니다." };
    }
  };

  getUserLikedPosts = async (user: Express.User) => {
    const userLikedPosts = await prisma.likes.findMany({
      where: { userId: user.userId },
      select: { postId: true },
    });
    const likedPostIds = userLikedPosts.map((like) => like.postId);

    const rawLikedPosts = await prisma.posts.findMany({
      where: { postId: { in: likedPostIds } },
      select: {
        postId: true,
        userId: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        likeCount: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });

    const result: PostResponse[] = rawLikedPosts.map(
      ({ user, likeCount, ...rest }) => ({
        ...rest,
        nickname: user.nickname,
        likeCount: likeCount,
        isLiked: true,
      })
    );
    return result;
  };
}

export default LikesRepository;
