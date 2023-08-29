import { LoginRequest, SignUpRequest } from "../dtos/users";
import UsersRepository from "../repositories/users";

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
