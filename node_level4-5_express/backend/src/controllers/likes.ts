import { UserLikedPostsResponse } from "./../dtos/likes";
import { LoginResponse } from "./../dtos/auth";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import LikesService from "../services/likes";

export const togglePostLike = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId: number = +req.params.postId;
    const user: LoginResponse = {
      nickname: res.locals.decoded.nickname,
      userId: res.locals.decoded.userId,
    };
    const result = await LikesService.togglePostLike(user, postId);
    res.send({ message: result });
  }
);

export const getUserLikedPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: LoginResponse = {
      nickname: res.locals.decoded.nickname,
      userId: res.locals.decoded.userId,
    };
    const result: UserLikedPostsResponse[] =
      await LikesService.getUserLikedPosts(user);
    res.send({ posts: result });
  }
);
