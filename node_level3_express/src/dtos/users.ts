export type SignUpRequest = {
  nickname: string;
  password: string;
  confirm: string;
};

export type LoginRequest = {
  nickname: string;
  password: string;
};
