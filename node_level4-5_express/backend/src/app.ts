import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import { config } from "dotenv";

import mainRouter from "./routes";

import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";

config(); // process.env

const app = express();
app.set("port", process.env.PORT || 8000);

app.use(morgan("dev")); // 배포시엔 'combined'
app.use(express.static(path.join(__dirname, "public"))); // 퍼블릭폴더를 프론트에서 접근 가능하게 함.
app.use(express.static(path.join(__dirname, "../../frontend/build"))); // 퍼블릭폴더를 프론트에서 접근 가능하게 함.

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
app.use("/api", mainRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});

// 404 미들웨어
app.use(notFound);

// 에러 처리 핸들러 미들웨어
app.use(errorHandler);



app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 실행");
});
