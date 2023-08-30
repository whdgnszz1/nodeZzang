import { LoginRequest, SignUpRequest } from "../dtos/auth";
import UsersRepository from "../repositories/auth";

class UsersService {
  signUp = async (user: SignUpRequest) => {
    const newUser = await UsersRepository.signUp(user);
    return newUser;
  };

  login = async (user: LoginRequest) => {
    await UsersRepository.login(user);
    return;
  };
}

export default new UsersService();
