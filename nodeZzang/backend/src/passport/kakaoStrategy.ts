import passport from "passport";
import { Strategy as KaKaoStrategy } from "passport-kakao";
import prisma from "../utils/prisma";

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
            done(null, { user: existUser, accessToken });
          } else {
            const newUser = await prisma.users.create({
              data: {
                email: profile._json?.kakao_account?.email,
                nickname: profile.displayName,
                snsId: String(profile.id),
                provider: "kakao",
              },
            });
            done(null, { user: newUser, accessToken });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
