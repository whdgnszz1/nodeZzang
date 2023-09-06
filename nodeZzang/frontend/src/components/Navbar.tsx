import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "src/states/userState";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(userState);
  const navigate = useNavigate();

  const logout = () => {
    setIsLoggedIn(false);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem('user')
    navigate("/login");
  };
  return (
    <div className="flex justify-between z-20 px-2 h-12 bg-rose-400 items-center text-white font-medium fixed top-0 w-[768px] border-x-2 border-b-2 border-black">
      <div className="cursor-pointer h-full w-20">
        <img
          onClick={() => navigate("/")}
          src={process.env.PUBLIC_URL + "/assets/logo.png"}
          alt="logo"
          className="pt-1 w-10"
        />
      </div>
      <div className="flex justify-center items-center cursor-default">
        노드짱
      </div>
      {isLoggedIn ? (
        <div
          onClick={logout}
          className="cursor-pointer flex items-center justify-end w-20"
        >
          로그아웃
        </div>
      ) : (
        <div onClick={() => navigate("/login")} className="cursor-pointer flex items-center w-20">
          로그인
        </div>
      )}
    </div>
  );
};

export default Navbar;
