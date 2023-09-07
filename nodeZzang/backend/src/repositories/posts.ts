import { PostRequest, PostResponse } from "../dtos/posts";
import { CustomError } from "../errors/customError";
import prisma from "../utils/prisma/index";

class PostsRepository {
  getPostById = async (postId: number) => {
    const post = await prisma.posts.findFirst({
      where: { postId },
    });

    if (!post) {
      throw new CustomError(404, "해당하는 게시글을 찾을 수 없습니다.");
    }

    return post;
  };

  createPost = async (user: Express.User, post: PostRequest) => {
    return prisma.posts.create({
      data: {
        userId: user.userId,
        ...post,
      },
    });
  };

  getAllPosts = async (userId?: number) => {
    const allPosts = await prisma.posts.findMany({
      include: { user: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    const likedPostIds = userId
      ? (
          await prisma.likes.findMany({
            where: { userId },
            select: { postId: true },
          })
        ).map((like) => like.postId)
      : [];

    const result: PostResponse[] = allPosts.map((post) => ({
      postId: post.postId,
      userId: post.userId,
      nickname: post.user.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likeCount: post.likeCount,
      isLiked: likedPostIds.includes(post.postId),
    }));
    return result;
  };

  getOnePost = async (postId: number, userId?: number) => {
    const post = await prisma.posts.findFirst({
      where: { postId },
      include: { user: true },
    });

    if (!post) {
      throw new CustomError(404, "해당하는 게시글을 찾을 수 없습니다.");
    }

    const likeCount = await prisma.likes.count({
      where: { postId },
    });

    let isLiked = false;

    if (userId) {
      const userLike = await prisma.likes.findFirst({
        where: { postId, userId },
      });

      isLiked = Boolean(userLike);
    }

    const result: PostResponse = {
      postId: post.postId,
      userId: post.userId,
      nickname: post.user.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likeCount: likeCount,
      isLiked: isLiked,
    };
    return result;
  };

  updateOnePost = async (
    user: Express.User,
    postId: number,
    updatePostRequest: PostRequest
  ) => {
    const post = await this.getPostById(postId);

    if (user.userId !== post.userId) {
      throw new CustomError(403, "게시글 수정의 권한이 존재하지 않습니다.");
    }

    return prisma.posts.update({
      where: { postId },
      data: {
        title: updatePostRequest.title,
        content: updatePostRequest.content,
      },
    });
  };

  deleteOnePost = async (user: Express.User, postId: number) => {
    const post = await this.getPostById(postId);

    if (user.userId !== post.userId) {
      throw new CustomError(403, "게시글 삭제의 권한이 존재하지 않습니다.");
    }

    await prisma.posts.delete({ where: { postId } });
    return { message: "게시글을 삭제하였습니다." };
  };
}

export default PostsRepository;
