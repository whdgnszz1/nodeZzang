import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "src/axios";
import AuthInput from "src/components/AuthInput";

const Signup = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate()

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleConfirmChange = (value: string) => {
    setConfirm(value);
  };

  const handleSubmit = async () => {
    if (password !== confirm) {
      alert("비밀번호와 비밀번호 확인 값이 일치하지 않습니다.");
      return;
    }

    try {
      const response = await postAPI("/api/signup", {
        nickname,
        password,
        confirm,
      });
      console.log(response.data);
      navigate('/login')
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className=" h-screen flex justify-center items-center">
        <div className="bg-rose-400 w-[768px] h-[1000px] flex flex-col items-center justify-center gap-4 rounded-xl">
          <h1>노드짱짱</h1>
          <AuthInput inputType="닉네임" onInputChange={handleNicknameChange} />
          <AuthInput
            inputType="비밀번호"
            onInputChange={handlePasswordChange}
          />
          <AuthInput
            inputType="비밀번호 확인"
            onInputChange={handleConfirmChange}
          />
          <button
            onClick={handleSubmit}
            className="bg-white w-[320px] rounded-md py-1"
          >
            회원가입
          </button>
        </div>
      </div>
    </>
  );
};

export default Signup;
