import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";

export const local = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "nickname", // req.body.nickname
        passwordField: "password", // req.body.password
        passReqToCallback: false,
      },
      async (nickname, password, done) => {
        // done(서버실패, 성공유저, 로직실패)
        try {
          const existUser: Express.User | null = await prisma.users.findFirst({
            where: { nickname: nickname },
            select: {
              userId: true,
              nickname: true,
              password: true,
            },
          });
          if (existUser) {
            // 1. password가 없는 req.user을 생성하려고 delete existUser.password를 했음
            // 2. bcrypt의 두번째 인자엔 undefined가 들어올 수 없으므로 existUser의 password를 검증해야 하는 상황
            // 3-1. 유저의 password는 required 값이므로 existUser.password as string 을 해주는게 맞는지
            // 3-2. 혹시나의 오류에 대비해서 undefined에 대한 분기처리를 해주는게 맞는지
            if (existUser.password) {
              const result = await bcrypt.compare(password, existUser.password);
              if (result) {
                delete existUser.password;
                done(null, existUser);
              } else {
                done(null, false, {
                  message: "닉네임 또는 패스워드를 확인해주세요",
                });
              }
            }
          } else {
            done(null, false, {
              message: "닉네임 또는 패스워드를 확인해주세요",
            });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
