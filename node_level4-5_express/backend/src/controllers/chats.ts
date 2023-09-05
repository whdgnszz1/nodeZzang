import { NextFunction, Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import Chat from "../schemas/chat";
import Room from "../schemas/room";

export const createRoom = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, password, maxMembers } = req.body;
    const user = res.locals.decoded;
    const newRoom = await Room.create({
      title,
      password,
      maxMembers,
      owner: user.nickname,
    });
    const io = req.app.get("io");
    io.of("/room").emit("newRoom", newRoom);
    res.status(200).send({ message: "채팅방을 생성하였습니다." });
  }
);

export const getRooms = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const rooms = await Room.find({});
    res.json({ rooms });
  }
);

export const enterRoom = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const roomId = req.params.roomId;
    const chats = await Chat.find({ roomId: roomId });
    res.status(200).json({ chats });
  }
);

export const deleteRoom = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {}
);
