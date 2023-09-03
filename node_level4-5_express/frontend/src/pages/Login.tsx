import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "src/axios";
import AuthInput from "src/components/AuthInput";
import { useRecoilState } from "recoil";
import { userState } from "src/states/userState";

const Login = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [, setIsLoggedIn] = useRecoilState(userState);
  const navigate = useNavigate();

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleSubmit = async () => {
    try {
      await postAPI("/api/login", {
        nickname,
        password,
      }).then((data) => {
        setIsLoggedIn(true);
        console.log(data)
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
