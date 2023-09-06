export interface User {
  userId: string;
  nickname: string;
  profileUrl: string;
}

export interface SignupRequest {
  nickname: string;
  password: string;
  confirm: string;
}
