import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";

export default () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.REDIRECT_URL}/api/google/callback`,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const existUser = await prisma.users.findUnique({
            where: {
              snsId_provider: { snsId: profile.id, provider: "google" },
            },
          });

          if (existUser) {
            const googleLoggedInToken = jwt.sign(
              { userId: existUser.userId, nickname: existUser.nickname },
              process.env.JWT_SECRET!,
              { expiresIn: "1h" }
            );
            req.cookies.googleLoggedInToken = googleLoggedInToken;

            done(null, existUser);
          } else {
            const newUser = await prisma.users.create({
              data: {
                email: profile.emails
                  ? profile.emails[0].value
                  : "default@gmail.com",
                nickname: profile.displayName,
                snsId: profile.id,
                provider: "google",
              },
            });

            const googleLoggedInToken = jwt.sign(
              { userId: newUser.userId, nickname: newUser.nickname },
              process.env.JWT_SECRET!,
              { expiresIn: "1h" }
            );
            req.cookies.googleLoggedInToken = googleLoggedInToken;

            done(null, newUser);
          }
        } catch (error: any) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
