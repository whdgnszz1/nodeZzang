import { UserLikedPostsResponse } from "./../dtos/likes";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import LikesService from "../services/likes";
import { getUserFromToken } from "./auth";

export const togglePostLike = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId: number = +req.params.postId;
    const user = getUserFromToken(res);

    const result = await LikesService.togglePostLike(user, postId);
    res.send({ message: result });
  }
);

export const getUserLikedPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = getUserFromToken(res);

    const result: UserLikedPostsResponse[] =
      await LikesService.getUserLikedPosts(user);
    res.send({ posts: result });
  }
);
