import { CreatePostDto } from './../dto/posts.request.dto';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PutRequestDto } from '../dto/posts.request.dto';
import { PostsRepository } from '../posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async getAllPosts() {
    const posts = await this.postsRepository.getAllPosts();
    const result = posts.map((post) => post.readOnlyData);
    return result;
  }

  async createPost(body: CreatePostDto) {
    await this.postsRepository.create(body);
    return { message: '게시글을 생성하였습니다.' };
  }

  async getOnePost(id: string) {
    const post = await this.postsRepository.existsById(id);
    if (!post) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }

    return post.readOnlyData;
  }

  async updateOnePost(id: string, body: PutRequestDto, nickname: string) {
    const { title, content } = body;
    const post = await this.postsRepository.existsById(id);
    if (!post) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }
    if (post.nickname !== nickname) {
      throw new UnauthorizedException('접근 불가능한 기능입니다.');
    }

    post.title = title;
    post.content = content;

    await post.save();

    return { message: '게시글을 수정하였습니다.' };
  }

  async deletePost(id: string, nickname: string) {
    const post = await this.postsRepository.existsById(id);
    if (!post) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }
    if (post.nickname !== nickname) {
      throw new UnauthorizedException('접근 불가능한 기능입니다.');
    }

    await this.postsRepository.deletePost(id);

    return { message: '게시글을 삭제하였습니다.' };
  }
}
