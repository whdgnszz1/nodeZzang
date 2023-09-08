import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../utils/prisma";
// import jwt from "jsonwebtoken";

export default () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.SERVER_URL}/api/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existUser = await prisma.users.findUnique({
            where: {
              snsId_provider: { snsId: profile.id, provider: "google" },
            },
          });

          if (existUser) {
            // const googleLoggedInToken = jwt.sign(
            //   { userId: existUser.userId, nickname: existUser.nickname },
            //   process.env.JWT_SECRET!,
            //   { expiresIn: "1h" }
            // );

            return done(null, existUser);
          }

          let nickname = profile.displayName;
          let count = 1;

          let existingNicknameUser;
          while (true) {
            existingNicknameUser = await prisma.users.findUnique({
              where: { nickname: nickname },
            });
            if (!existingNicknameUser) break;
            nickname = `${profile.displayName}${count}`;
            count++;
          }

          const newUser = await prisma.users.create({
            data: {
              email: profile.emails
                ? profile.emails[0].value
                : "default@gmail.com",
              nickname: nickname,
              snsId: profile.id,
              provider: "google",
            },
          });

          // const googleLoggedInToken = jwt.sign(
          //   { userId: newUser.userId, nickname: newUser.nickname },
          //   process.env.JWT_SECRET!,
          //   { expiresIn: "1h" }
          // );

          return done(null, newUser);
        } catch (error: any) {
          console.error("Error during Google authentication:", error);
          return done(error);
        }
      }
    )
  );
};
