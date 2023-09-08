import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "src/axios";
import AuthInput from "src/components/AuthInput";
import { useRecoilState } from "recoil";
import { userState } from "src/states/userState";

const Login: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [, setIsLoggedIn] = useRecoilState<boolean>(userState);
  const navigate = useNavigate();

  /* input값 관리하는 코드 */
  const handleNicknameChange = (value: string): void => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string): void => {
    setPassword(value);
  };

  /* 로그인 로직 */
  const handleSubmit = async (): Promise<void> => {
    if (!email) {
      alert("이메일을 입력해주세요");
      return;
    }

    if (!password) {
      alert("비밀번호를 입력해주세요");
      return;
    }

    try {
      await postAPI("/api/login", {
        email,
        password,
      }).then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsLoggedIn(true);
      });
      navigate("/");
    } catch (error: any) {
      console.error(error);
      alert(error.response.data.message);
    }
  };

  const handleKakaoLogin = () => {
    const SERVER_URL =
      process.env.REACT_APP_SERVER_URL || "http://localhost:8000";
    const kakaoOauthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&redirect_uri=${encodeURIComponent(
      `${SERVER_URL}/api/kakao/callback`
    )}&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}`;
    window.location.href = kakaoOauthURL;
  };

  const handleGoogleLogin = () => {
    const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8000";
    const stateValue = generateRandomState(); // CSRF 공격 방지를 위한 임의의 문자열 생성
    const googleOauthURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${encodeURIComponent(`${SERVER_URL}/api/google/callback`)}&state=${stateValue}&access_type=offline`;
    window.location.href = googleOauthURL;
  };
  
  function generateRandomState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <div
        className="h-full min-h-screen flex justify-center items-center"
        onKeyPress={handleKeyPress}
        tabIndex={0}
      >
        <div className="w-[768px] h-[1000px] border-2 border-black flex flex-col items-center justify-center gap-4">
          <div className="border-2  w-[320px] border-black px-1">
            <AuthInput
              inputType="이메일"
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

          <button
            onClick={handleKakaoLogin}
            className="bg-[#FAE100] w-[320px] text-black font-semibold py-1 border-2 border-none"
          >
            카카오로 로그인
          </button>
          <button
            onClick={handleGoogleLogin}
            className="bg-white w-[320px] font-semibold py-1 border-2 border-black"
          >
            구글 로그인
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white w-[320px] font-semibold py-1 border-2 border-black"
          >
            회원가입 하러가기
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
