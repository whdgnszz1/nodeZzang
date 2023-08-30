import {
  CreatePostRequestDto,
  PutPostRequestDto,
} from './../dto/posts.request.dto';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsRepository } from '../posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async getAllPosts() {
    const posts = await this.postsRepository.getAllPosts();
    const result = posts.map((post) => post);
    return result;
  }

  async createPost(body: CreatePostRequestDto) {
    await this.postsRepository.create(body);
    return { message: '게시글을 생성하였습니다.' };
  }

  async getOnePost(postId: number, userId: number) {
    const post = await this.postsRepository.existsById(postId, userId);
    if (!post) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }

    return post;
  }

  async updateOnePost(id: number, body: PutPostRequestDto, nickname: string) {
    const { title, content } = body;
    const post = await this.postsRepository.existsById(id, null);
    if (!post) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }
    if (post.nickname !== nickname) {
      throw new UnauthorizedException('접근 불가능한 기능입니다.');
    }

    post.title = title;
    post.content = content;

    return { message: '게시글을 수정하였습니다.' };
  }

  async deletePost(id: number, nickname: string) {
    const post = await this.postsRepository.existsById(id, null);
    if (!post) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }
    if (post.nickname !== nickname) {
      throw new UnauthorizedException('접근 불가능한 기능입니다.');
    }

    await this.postsRepository.deletePost(id);

    return { message: '게시글을 삭제하였습니다.' };
  }

  async toggleLike(postId: number, userId: number) {
    const post = await this.postsRepository.existsById(postId, userId);
    if (!post) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }

    const result = await this.postsRepository.toggleLike(postId, userId);

    return { message: result };
  }
}
