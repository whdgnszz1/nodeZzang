import { postAPI } from "src/axios";
import { SignupRequest } from "src/types/userType";

export const signUp = async (newUser: SignupRequest) =>
  await postAPI("/api/signup", newUser);
