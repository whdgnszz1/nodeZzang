import passport from "passport";
import { Strategy as KaKaoStrategy } from "passport-kakao";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";

export default () => {
  passport.use(
    new KaKaoStrategy(
      {
        clientID: process.env.KAKAO_ID!,
        callbackURL: `${process.env.REDIRECT_URL}/api/kakao/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existUser = await prisma.users.findUnique({
            where: {
              snsId_provider: { snsId: String(profile.id), provider: "kakao" },
            },
          });
          if (existUser) {
            const kakaoLoggedInToken = jwt.sign(
              { userId: existUser.userId, nickname: existUser.nickname },
              process.env.JWT_SECRET!,
              { expiresIn: "1h" }
            );
            done(null, { user: existUser, kakaoLoggedInToken });
          } else {
            const newUser = await prisma.users.create({
              data: {
                email: profile._json?.kakao_account?.email,
                nickname: profile.displayName,
                snsId: String(profile.id),
                provider: "kakao",
              },
            });
            const kakaoLoggedInToken = jwt.sign(
              { userId: newUser.userId, nickname: newUser.nickname },
              process.env.JWT_SECRET!,
              { expiresIn: "1h" }
            );
            done(null, { user: newUser, kakaoLoggedInToken });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
