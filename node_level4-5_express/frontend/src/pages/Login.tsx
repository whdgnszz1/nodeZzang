import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "src/axios";
import AuthInput from "src/components/AuthInput";
import { useRecoilState } from "recoil";
import { userState } from "src/states/userState";

const Login: FC = () => {
  const [nickname, setNickname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [, setIsLoggedIn] = useRecoilState<boolean>(userState);
  const navigate = useNavigate();
  
  /* input값 관리하는 코드 */
  const handleNicknameChange = (value: string): void => {
    setNickname(value);
  };

  const handlePasswordChange = (value: string): void => {
    setPassword(value);
  };

  /* 로그인 로직 */
  const handleSubmit = async (): Promise<void> => {
    try {
      await postAPI("/api/login", {
        nickname,
        password,
      }).then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsLoggedIn(true);
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className=" h-screen flex justify-center items-center">
        <div className="w-[768px] h-[1000px] border-2 border-black flex flex-col items-center justify-center gap-4">
          <div className="border-2  w-[320px] border-black px-1">
            <AuthInput
              inputType="닉네임"
              onInputChange={handleNicknameChange}
            />
          </div>
          <div className="border-2  w-[320px] border-black px-1">
            <AuthInput
              inputType="비밀번호"
              onInputChange={handlePasswordChange}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-white w-[320px] font-semibold py-1 border-2 border-black"
          >
            로그인
          </button>
          <button className="bg-white w-[320px] font-semibold py-1 border-2 border-black">
            카카오 로그인
          </button>
          <button className="bg-white w-[320px] font-semibold py-1 border-2 border-black">
            구글 로그인
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
