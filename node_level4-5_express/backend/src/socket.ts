import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { Application } from "express";
import Chat from "./schemas/chat";

interface ExtendedSocket extends Socket {
  interval?: NodeJS.Timeout; // interval might be a NodeJS timer, adjust the type as needed
}

export const setupWebSocket = (httpServer: HttpServer, app: Application) => {
  const io = new Server(httpServer, {
    path: "/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  // 전체에 저장하는 것
  app.set("io", io);
  const room = io.of("/room");
  const chat = io.of("/chat");

  room.on("connection", (socket) => {
    console.log("room 네임스페이스 접속");
    socket.on("join", (data) => {
      socket.join(data); // 방에 참가
    });
    socket.on("disconnect", () => {
      console.log("room 네임스페이스 접속 해제");
    });
    socket.on("connect_error", (error) => {
      console.error("연결 오류:", error);
    });
  });

  chat.on("connection", (socket) => {
    socket.on("join", (data) => {
      socket.join(data); // 방에 참가
    });
    socket.on("sendMessage", async (data) => {
      await Chat.create({
        message: data.message,
        roomId: data.roomId,
        userId: data.userId,
        nickname: data.nickname,
      });
      chat.to(data.roomId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("chat 네임스페이스 접속 해제");
    });
  });
  
  io.on("connection", (socket: ExtendedSocket) => {
    const req = socket.request;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("새로운 클라이언트 접속", ip);
    socket.on("disconnect", () => {
      console.log("클라이언트 접속 해제", ip, socket.id);
      clearInterval(socket.interval);
    });
    socket.on("error", console.error);
  });
};
