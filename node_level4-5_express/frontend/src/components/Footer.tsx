import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-around w-[768px] h-10 bg-rose-400 items-center text-white font-medium fixed bottom-0 border-x-2 border-t-2 border-black">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        게시글
      </div>
      <div onClick={() => navigate("/chat")} className="cursor-pointer">
        채팅방
      </div>
      <div onClick={() => navigate("/profile")} className="cursor-pointer">
        내정보
      </div>
    </div>
  );
}

export default Footer;
