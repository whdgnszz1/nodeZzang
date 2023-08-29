import { Post } from "../dtos/posts";
import { CustomError } from "../errors/customError";
import prisma from "../utils/prisma/index";

class PostRepository {
  createPost = async (post: Post) => {
    const newPost: Post = await prisma.posts.create({ data: { ...post } });
    return newPost;
  };

  getAllPosts = async () => {
    const allPosts: Post[] = await prisma.posts.findMany({});
    return allPosts;
  };

  // 게시글을 찾지 못했을 때 null을 반환하려니 controller, service에 전부 타입지정을 해줘야해서
  // repository에서 error를 throw
  // Error의 객체엔 status 프로터티가 없어서 CustomError을 만들어 throw
  // 일반적으로 사용하는 방식이 맞는지?
  // Message로 분기처리하는게 나을지???
  getOnePost = async (postId: number): Promise<Post> => {
    const post = await prisma.posts.findFirst({
      where: { postId: postId },
    });

    if (!post) {
      throw new CustomError("해당하는 게시글을 찾을 수 없습니다.", 404);
    }

    return post;
  };

  updateOnePost = async (
    postId: number,
    password: string,
    title: string,
    content: string
  ): Promise<Post> => {
    const post = await prisma.posts.findFirst({
      where: { postId: postId },
    });

    if (!post) {
      throw new CustomError("해당하는 게시글을 찾을 수 없습니다.", 404);
    }

    if (password === post.password) {
      const updatedPost = await prisma.posts.update({
        where: { postId: postId },
        data: {
          title: title,
          content: content,
        },
      });
      return updatedPost;
    } else {
      throw new CustomError("비밀번호가 일치하지 않습니다.", 401);
    }
  };

  deleteOnePost = async (postId: number, password: string) => {
    const post = await prisma.posts.findFirst({
      where: { postId: postId },
    });

    if (!post) {
      throw new CustomError("해당하는 게시글을 찾을 수 없습니다.", 404);
    }

    if (password === post.password) {
      await prisma.posts.delete({
        where: { postId: postId },
      });
      return { message: "게시글을 삭제하였습니다." };
    } else {
      throw new CustomError("비밀번호가 일치하지 않습니다.", 401);
    }
  };
}

export default new PostRepository();
