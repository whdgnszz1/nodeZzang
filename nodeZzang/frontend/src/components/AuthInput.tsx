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
    onInputChange(value);
  };

  return (
    <div className="flex gap-1">
      <div className="w-[100px] text-1.25rem font-semibold flex items-center border-r-2 border-black">
        {inputType}
      </div>
      <input
        onChange={handleChange}
        type={inputType.includes("비밀번호") ? "password" : "text"}
        className="px-2 py-1 text-start border-black border-1 focus:border-none focus:outline-none"
      />
    </div>
  );
};

export default AuthInput;
