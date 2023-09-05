import {
  CreatePostRequest,
  OnePostResponse,
  UpdatePostRequest,
} from "../dtos/posts";
import { CustomError } from "../errors/customError";
import prisma from "../utils/prisma/index";

class PostsRepository {
  getPostById = async (postId: number) => {
    const post = await prisma.posts.findFirst({
      where: { postId: postId },
    });

    return post;
  };

  createPost = async (user: Express.User, post: CreatePostRequest) => {
    const { userId, nickname } = user;
    const newPost = await prisma.posts.create({
      data: {
        userId: userId,
        nickname: nickname,
        ...post,
      },
    });
    return newPost;
  };

  getAllPosts = async (userId: number) => {
    const allPosts = await prisma.posts.findMany({});

    if (typeof userId === "undefined") {
      return allPosts.map((post) => ({ ...post, isLiked: false }));
    }

    const postsWithLikes = await Promise.all(
      allPosts.map(async (post) => {
        const isLiked = await prisma.likes.findFirst({
          where: {
            postId: post.postId,
            userId: userId,
          },
        });
        return {
          ...post,
          isLiked: Boolean(isLiked),
        };
      })
    );

    return postsWithLikes;
  };

  getOnePost = async (postId: number): Promise<OnePostResponse> => {
    const post: OnePostResponse | null = await prisma.posts.findFirst({
      where: { postId: postId },
      select: {
        postId: true,
        userId: true,
        nickname: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!post) {
      throw new CustomError(404, "해당하는 게시글을 찾을 수 없습니다.");
    }

    return post;
  };

  updateOnePost = async (
    user: Express.User,
    postId: number,
    updatePostRequest: UpdatePostRequest
  ) => {
    const post = await this.getPostById(postId);

    if (!post) {
      throw new CustomError(404, "해당하는 게시글을 찾을 수 없습니다.");
    }

    if (user.userId === post.userId) {
      const updatedPost = await prisma.posts.update({
        where: { postId: postId },
        data: {
          title: updatePostRequest.title,
          content: updatePostRequest.content,
        },
      });
      return updatedPost;
    } else {
      throw new CustomError(403, "게시글 수정의 권한이 존재하지 않습니다.");
    }
  };

  deleteOnePost = async (user: Express.User, postId: number) => {
    const post = await this.getPostById(postId);

    if (!post) {
      throw new CustomError(404, "해당하는 게시글을 찾을 수 없습니다.");
    }

    if (user.userId === post.userId) {
      await prisma.posts.delete({
        where: { postId: postId },
      });
      return { message: "게시글을 삭제하였습니다." };
    } else {
      throw new CustomError(403, "게시글 삭제의 권한이 존재하지 않습니다..");
    }
  };

  toggleLikePost = async (user: Express.User, postId: number) => {
    const userId: number = user.userId;
    const isExistLike = await prisma.likes.findFirst({
      where: { userId: userId, postId: postId },
    });
    if (isExistLike) {
      await prisma.likes.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });
      return { message: "게시글의 좋아요를 취소하였습니다." };
    } else {
      await prisma.likes.create({ data: { userId, postId } });
      return { message: "게시글의 좋아요를 등록하였습니다." };
    }
  };
}

export default new PostsRepository();
