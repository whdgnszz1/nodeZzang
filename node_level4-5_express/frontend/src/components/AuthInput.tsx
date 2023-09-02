import React, { useState } from "react";

type Props = {
  inputType: string;
  onInputChange: (value: string) => void;
};

const AuthInput: React.FC<Props> = ({ inputType, onInputChange }) => {
  const [, setInputValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onInputChange(value); // 부모 컴포넌트로 입력값 전달
  };

  return (
    <div className="flex gap-1">
      <div className="w-[100px] text-1.25rem text-white font-semibold flex items-center">
        {inputType}
      </div>
      <input
        onChange={handleChange}
        type={inputType.includes("비밀번호") ? "password" : "text"}
        className="rounded-xl px-4 py-1 text-start"
      />
    </div>
  );
};

export default AuthInput;
