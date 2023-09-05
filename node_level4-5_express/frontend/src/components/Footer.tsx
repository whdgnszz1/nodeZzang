import {
  BsChatHeart,
  BsChatHeartFill,
  BsPerson,
  BsPersonFill,
  BsPostcardHeart,
  BsPostcardHeartFill,
} from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex justify-around w-[768px] h-10 bg-rose-400 items-center text-white font-medium fixed bottom-0 border-x-2 border-t-2 border-black">
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex flex-col items-center"
      >
        {isActive("/") ? (
          <BsPostcardHeartFill size={24} />
        ) : (
          <BsPostcardHeart size={24} />
        )}
      </div>
      <div
        onClick={() => navigate("/chat")}
        className="cursor-pointer flex flex-col items-center"
      >
        {isActive("/chat") ? (
          <BsChatHeartFill size={24} />
        ) : (
          <BsChatHeart size={24} />
        )}
      </div>
      <div
        onClick={() => navigate("/profile")}
        className="cursor-pointer flex flex-col items-center"
      >
        {isActive("/profile") ? (
          <BsPersonFill size={24} />
        ) : (
          <BsPerson size={24} />
        )}
      </div>
    </div>
  );
}

export default Footer;
