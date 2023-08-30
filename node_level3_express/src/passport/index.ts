import prisma from "../utils/prisma";
import passport from "passport";
import { local } from "./localStrategy";
import { kakao } from "./kakaoStrategy";

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
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
