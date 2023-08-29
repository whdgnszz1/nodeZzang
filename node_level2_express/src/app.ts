import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import { config } from "dotenv";

import PostsRouter from "./routes/posts";
import CommentsRouter from "./routes/comments";

config(); // process.env

const app = express();
app.set("port", process.env.PORT || 8000);

app.use(morgan("dev")); // 배포시엔 'combined'
app.use(express.static(path.join(__dirname, "public"))); // 퍼블릭폴더를 프론트에서 접근 가능하게 함.
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // form 요청 받는 설정
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || 'defaultSecret',
    cookie: {
      httpOnly: true,
      secure: false, // https적용할때 true로 변경
    },
  })
);

// router
app.use("/posts", [PostsRouter]);
app.use("/posts/:postId/comments", [CommentsRouter]);

// 404 NOT FOUND

interface CustomError extends Error {
  status?: number;
}

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: CustomError = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// error처리 미들웨어: 배포모드일때는 해커들이 error를 보고 서버를 공격할 수 있음
app.use((err: CustomError, req: Request, res:Response, next:NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 실행");
});
