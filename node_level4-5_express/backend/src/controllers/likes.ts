import { NextFunction, Request, Response } from "express";
import { PostResponse } from "../dtos/posts";
import asyncHandler from "../lib/asyncHandler";
import LikesService from "../services/likes";
import { getUserFromToken } from "./auth";

class LikesController {
  constructor(private readonly likesService: LikesService) {}

  togglePostLike = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: number = +req.params.postId;
      const user = getUserFromToken(res);

      const result = await this.likesService.togglePostLike(user, postId);
      res.send({ message: result });
    }
  );

  getUserLikedPosts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = getUserFromToken(res);

      const result: PostResponse[] = await this.likesService.getUserLikedPosts(
        user
      );
      res.send({ posts: result });
    }
  );
}

export default LikesController;
