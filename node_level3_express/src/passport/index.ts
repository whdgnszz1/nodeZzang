import prisma from "../utils/prisma";
import passport from "passport";
import { local } from "./localStrategy";

passport.serializeUser((user: Express.User, done) => {
  // user === existUser
  done(null, user.userId);
});

// serializeUser 끝나면 connect.sid 쿠키에서 id를 가져온다.
// id를 통해서 유저의 정보를 복원.
// passport는 session으로 로그인을 하는 방식인데, session과 jwt방식을 전부 사용하는데에 의미가 있을지?
// passport의 장점: 소셜로그인에 도움될 수 있음
// JWT의 장점: stateless 방식
passport.deserializeUser((id: number, done) => {
  prisma.users
    .findFirst({
      where: { userId: id },
    })
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

const initializePassport = () => {
  local();
};

export default initializePassport;
