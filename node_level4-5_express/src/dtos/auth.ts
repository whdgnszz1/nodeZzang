export type SignUpRequest = {
  nickname: string;
  password: string;
  confirm: string;
};

export type LoginRequest = {
  nickname: string;
  password: string;
};

export type LoginResponse = {
  nickname: string;
  userId: number;
};

export type DecodedToken = {
  nickname: string;
  userId: number;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface User {
      userId: number;
      nickname: string;
      password?: string;
    }
  }
}
