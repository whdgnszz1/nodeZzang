export type SignUpRequest = {
  email: string;
  nickname: string;
  password: string;
  confirm: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  nickname: string;
  userId: number;
  profileUrl?: string | null;
};

export type DecodedToken = {
  nickname: string;
  userId: number;
  iat: number;
  exp: number;
};

declare global {
  namespace Express {
    interface User {
      userId: number;
      nickname: string;
      password?: string | null;
      profileUrl?: string | null;
      accessToken?: string | null;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    file: Express.MulterS3.File;
  }
}
