import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import { config } from "dotenv";

import PostsRouter from "./routes/posts";
import CommentsRouter from "./routes/comments";
import UsersRouter from "./routes/auth";

import { CustomError } from "./errors/customError";


config(); // process.env

const app = express();
app.set("port", process.env.PORT || 8000);

app.use(morgan("dev")); // 배포시엔 'combined'
app.use(express.static(path.join(__dirname, "public"))); // 퍼블릭폴더를 프론트에서 접근 가능하게 함.
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // form 요청 받는 설정
app.use(cookieParser(process.env.COOKIE_SECRET)); // { connect.sid : 123144359}
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || "defaultSecret",
    cookie: {
      httpOnly: true,
      secure: false, // https적용할때 true로 변경
    },
  })
);


// router
app.use("/api/posts", [PostsRouter]);
app.use("/api/posts/:postId/comments", [CommentsRouter]);
app.use("/api", [UsersRouter]);

// 404 NOT FOUND
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (err.status === 404) {
    res.status(404).send(err.message);
  }
  const response = {
    message: err.message,
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  };

  res.status(err.status || 500).json(response);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 실행");
});
