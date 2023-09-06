export interface User {
  userId: string;
  nickname: string;
  profileUrl: string;
}

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
  confirm: string;
}
