import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "src/axios";
import AuthInput from "src/components/AuthInput";


const isValidNickname = (nickname: string) => {
  // 최소 3자, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)만 가능한 정규표현식
  const regex = /^[a-zA-Z0-9]{3,}$/;
  return regex.test(nickname);
};

const isValidPassword = (password: string, nickname: string) => {
  // 최소 4자 이상이어야 하며, 닉네임과 같은 값이 포함되지 않아야 함
  return password.length >= 4 && !password.includes(nickname);
};




const Signup = () => {
  const [nickname, setNickname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const navigate = useNavigate();

  /* 회원가입 로직 */
  const handleSubmit = async () => {
    // 닉네임 유효성 검사
    if (!isValidNickname(nickname)) {
      alert("닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로만 구성해야 합니다.");
      return;
    }
  
    // 비밀번호와 비밀번호 확인 값이 일치하는지 검사
    if (password !== confirm) {
      alert("비밀번호와 비밀번호 확인 값이 일치하지 않습니다.");
      return;
    }
  
    // 비밀번호 유효성 검사
    if (!isValidPassword(password, nickname)) {
      alert("비밀번호는 최소 4자 이상이어야 하며, 닉네임과 같은 값을 포함하면 안됩니다.");
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
          회원가입 완료
        </button>
        <button
          onClick={() => navigate('/login')}
          className="bg-white w-[320px] border-2 font-semibold border-black py-1"
        >
          로그인 창으로
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-white w-[320px] border-2 font-semibold border-black py-1"
        >
          홈으로
        </button>
      </div>
    </div>
  );
};

export default Signup;
