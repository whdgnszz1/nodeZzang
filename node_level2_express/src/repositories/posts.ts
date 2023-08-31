import {
  AllPostResponse,
  CreatePostRequest,
  OnePostResponse,
  UpdatePostRequest,
} from "../dtos/posts";
import { CustomError } from "../errors/customError";
import prisma from "../utils/prisma/index";

class PostRepository {
  createPost = async (post: CreatePostRequest) => {
    const newPost = await prisma.posts.create({ data: { ...post } });
    return newPost;
  };

  getAllPosts = async () => {
    const allPosts: AllPostResponse[] = await prisma.posts.findMany({
      select: {
        postId: true,
        user: true,
        title: true,
        createdAt: true,
      },
    });
    return allPosts;
  };

  getOnePost = async (postId: number): Promise<OnePostResponse> => {
    const post: OnePostResponse | null = await prisma.posts.findFirst({
      where: { postId: postId },
      select: {
        postId: true,
        user: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    // null 처리 했고, return엔 null값이 없음에도 불구하고 service엔 null이 포함된 값으로 넘어가는 오류
    if (!post) {
      throw new CustomError(404, "해당하는 게시글을 찾을 수 없습니다.");
    }

    return post;
  };

  updateOnePost = async (
    postId: number,
    updatePostRequest: UpdatePostRequest
  ) => {
    const post = await prisma.posts.findFirst({
      where: { postId: postId },
    });

    if (!post) {
      throw new CustomError(404, "해당하는 게시글을 찾을 수 없습니다.");
    }

    if (updatePostRequest.password === post.password) {
      const updatedPost = await prisma.posts.update({
        where: { postId: postId },
        data: {
          title: updatePostRequest.title,
          content: updatePostRequest.content,
        },
      });
      return updatedPost;
    } else {
      throw new CustomError(401, "비밀번호가 일치하지 않습니다.");
    }
  };

  deleteOnePost = async (postId: number, password: string) => {
    const post = await prisma.posts.findFirst({
      where: { postId: postId },
    });

    if (!post) {
      throw new CustomError(404, "해당하는 게시글을 찾을 수 없습니다.");
    }

    if (password === post.password) {
      await prisma.posts.delete({
        where: { postId: postId },
      });
      return { message: "게시글을 삭제하였습니다." };
    } else {
      throw new CustomError(401, "비밀번호가 일치하지 않습니다.");
    }
  };
}

export default new PostRepository();
