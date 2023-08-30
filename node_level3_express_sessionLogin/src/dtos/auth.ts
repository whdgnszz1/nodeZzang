export type SignUpRequest = {
  nickname: string;
  password: string;
  confirm: string;
};

// passport/localStrategy.ts
// passport를 통한 로그인으로 usernameField, passwordField로 req.body를 받기 때문에 제거
// export type LoginRequest = {
//   nickname: string;
//   password: string;
// };

declare global {
  namespace Express {
    interface User {
      userId: number;
      nickname: string;
      password?: string;
    }
  }
}