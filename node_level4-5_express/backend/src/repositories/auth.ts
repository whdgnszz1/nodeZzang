import { LoginRequest, SignUpRequest } from "../dtos/auth";
import { CustomError } from "../errors/customError";
import prisma from "../utils/prisma/index";
import bcrypt from "bcrypt";

class UsersRepository {
  signUp = async (user: SignUpRequest) => {
    const existUser = await prisma.users.findFirst({
      where: { nickname: user.nickname },
    });
    if (existUser) {
      throw new CustomError(412, "중복된 닉네임입니다.");
    }
    if (user.password !== user.confirm) {
      throw new CustomError(412, "패스워드가 일치하지 않습니다.");
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await prisma.users.create({
      data: { nickname: user.nickname, password: hashedPassword },
    });
    return {message: "회원가입에 성공하였습니다."};
  };

  login = async (user: LoginRequest): Promise<Express.User> => {
    const existUser: Express.User | null = await prisma.users.findFirst({
      where: { nickname: user.nickname },
      select: {
        userId: true,
        nickname: true,
        password: true,
      },
    });
    if (!existUser) {
      throw new CustomError(412, "닉네임 또는 패스워드를 확인해주세요.");
    }
    if (existUser.password) {
      const validatePassword = await bcrypt.compare(
        user.password,
        existUser.password
      );
      if (validatePassword) {
        delete existUser.password;
        return existUser;
      } else {
        throw new CustomError(412, "닉네임 또는 패스워드를 확인해주세요");
      }
    }
    delete existUser.password;
    return existUser;
  };

  getUser = async (userId: number) => {
    const existUser: Express.User | null = await prisma.users.findFirst({
      where: { userId },
    });
    return existUser;
  };
}

export default new UsersRepository();
