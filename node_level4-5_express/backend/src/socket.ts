import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

interface ExtendedSocket extends Socket {
  interval?: NodeJS.Timeout; // interval might be a NodeJS timer, adjust the type as needed
}

export const setupWebSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    path: "/socket.io",
    transports: ['websocket'],
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
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

    // socket.on("reply", (data) => {
    //   console.log(data);
    // });

    // socket.interval = setInterval(() => {
    //   socket.emit("news", "하이하이");
    // }, 3000);
  });
};
