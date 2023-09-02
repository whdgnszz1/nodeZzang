import { UserLikedPostsResponse } from "./../dtos/likes";
import LikesRepository from "../repositories/likes";

class LikesService {
  togglePostLike = async (user: Express.User, postId: number) => {
    const result = await LikesRepository.toggleLikePost(user, postId);
    return result;
  };

  getUserLikedPosts = async (user: Express.User) => {
    const result: UserLikedPostsResponse[] =
      await LikesRepository.getUserLikedPosts(user);
    return result;
  };
}

export default new LikesService();
