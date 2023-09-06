import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: false,
});

export const userInfoState = atom({
  key: "userInfoState",
  default: {
    userId: null,
    nickname: null,
  },
});
