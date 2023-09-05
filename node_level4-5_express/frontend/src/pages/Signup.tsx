import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "src/axios";
import AuthInput from "src/components/AuthInput";

const Signup = () => {
  const [nickname, setNickname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const navigate = useNavigate();

  /* 회원가입 로직 */
  const handleSubmit = async () => {
    if (password !== confirm) {
      alert("비밀번호와 비밀번호 확인 값이 일치하지 않습니다.");
      return;
    }

    try {
      await postAPI("/api/signup", {
        nickname,
        password,
        confirm,
      });
      navigate("/login");
    } catch (error: any) {
        console.error(error);
        alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="h-screen min-h-screen flex justify-center items-center">
      <div className="border-black border-2 w-[768px] h-[1000px] flex flex-col items-center justify-center gap-4">
        <div className="border-2 w-[320px] border-black px-1">
          <AuthInput inputType="닉네임" onInputChange={setNickname} />
        </div>
        <div className="border-2 w-[320px] border-black px-1">
          <AuthInput inputType="비밀번호" onInputChange={setPassword} />
        </div>
        <div className="border-2 w-[320px] border-black px-1">
          <AuthInput inputType="비밀번호 확인" onInputChange={setConfirm} />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-white w-[320px] border-2 font-semibold border-black py-1"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Signup;
