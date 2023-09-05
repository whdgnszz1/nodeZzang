import { UserLikedPostsResponse } from "./../dtos/likes";
import LikesRepository from "../repositories/likes";

class LikesService {
  constructor(private readonly likesRepository: LikesRepository) {}
  togglePostLike = async (user: Express.User, postId: number) => {
    const result = await this.likesRepository.toggleLikePost(user, postId);
    return result;
  };

  getUserLikedPosts = async (user: Express.User) => {
    const result: UserLikedPostsResponse[] =
      await this.likesRepository.getUserLikedPosts(user);
    return result;
  };
}

export default LikesService;
