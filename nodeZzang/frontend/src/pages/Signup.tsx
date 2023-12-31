import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "src/api/userAPI";
import AuthInput from "src/components/AuthInput";

type FormField = "email" | "nickname" | "password" | "confirm";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    password: "",
    confirm: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: null,
    nickname: null,
    password: null,
    confirm: null,
  });

  const navigate = useNavigate();

  const validations = {
    email: (value: string) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(value) ? null : "이메일 형식이 올바르지 않습니다.";
    },
    nickname: (value: string) => {
      return value.trim() === "" ? "닉네임을 입력해주세요." : null;
    },
    password: (value: string) => {
      return value.length < 4 || value.includes(formData.nickname)
        ? "비밀번호는 최소 4자 이상이어야 하며, 닉네임과 같은 값을 포함하면 안됩니다."
        : null;
    },
    confirm: (value: string) => {
      return value !== formData.password
        ? "비밀번호와 비밀번호 확인 값이 일치하지 않습니다."
        : null;
    },
  };

  const handleChange = (field: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validations[field](value);
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    const hasError = Object.values(formErrors).some((error) => error);

    if (hasError) {
      alert("입력값을 확인해주세요.");
      return;
    }

    try {
      const { email, nickname, password, confirm } = formData;
      await signUp({ email, nickname, password, confirm });
      navigate("/login");
    } catch (error: any) {
      console.error(error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  const inputFields = [
    { key: "email" as FormField, label: "이메일" },
    { key: "nickname" as FormField, label: "닉네임" },
    { key: "password" as FormField, label: "비밀번호" },
    { key: "confirm" as FormField, label: "비밀번호 확인" },
  ];

  return (
    <div className="h-screen min-h-screen flex justify-center items-center">
      <div className="border-black border-2 w-[768px] h-[1000px] flex flex-col items-center justify-center gap-4">
        {inputFields.map((field) => (
          <div className="flex flex-col justify-center items-center gap-2 ">
            <div
              key={field.key}
              className="border-2 w-[320px] border-black px-1"
            >
              <AuthInput
                inputType={field.label}
                onInputChange={(value) => handleChange(field.key, value)}
              />
            </div>
            {formErrors[field.key] && (
              <span className="text-red-500 text-xs">
                {formErrors[field.key]}
              </span>
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-white w-[320px] border-2 font-semibold border-black py-1"
        >
          회원가입 완료
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-white w-[320px] border-2 font-semibold border-black py-1"
        >
          로그인 창으로
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-white w-[320px] border-2 font-semibold border-black py-1"
        >
          홈으로
        </button>
      </div>
    </div>
  );
};

export default Signup;
