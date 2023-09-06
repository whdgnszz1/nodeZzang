import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../lib/asyncHandler";
import Chat from "../schemas/chat";
import Room from "../schemas/room";

export const createRoom = (
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, password, maxMembers } = req.body;
    const user = res.locals.decoded;

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newRoom = await Room.create({
      title,
      password: hashedPassword,
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

    const transformedRooms = rooms.map((room) => {
      return { ...room.toObject(), password: !!room.password };
    });
    res.json({ rooms: transformedRooms });
  }
);

export const enterRoom = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const roomId = req.params.roomId;
    const inputPassword = req.body.password;
    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      return res.status(404).json({ message: "존재하지 않는 방입니다." });
    }

    if (inputPassword) {
      const isPasswordMatch = await bcrypt.compare(
        inputPassword,
        room.password as string
      );

      if (isPasswordMatch) {
        return res.status(200).json({
          message: "success",
          redirectTo: `/chat/${roomId}`,
        });
      } else {
        return res.status(403).json({ message: "Incorrect password" });
      }
    }

    const page = parseInt(req.query.page as string) || 1;
    const itemsPerPage = 20;
    const skip = (page - 1) * itemsPerPage;

    const chats = await Chat.find({ roomId: roomId })
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(itemsPerPage);

    return res.status(200).json({ chats });
  }
);

export const deleteRoom = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {}
);
