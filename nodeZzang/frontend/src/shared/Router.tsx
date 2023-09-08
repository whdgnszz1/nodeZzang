import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "src/pages/Login";
import Main from "src/pages/Main";
import Profile from "src/pages/Profile";
import Signup from "src/pages/Signup";
import Chat from "src/pages/Chat";
import Detail from "src/pages/Detail";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { userState } from "src/states/userState";
import Cookies from "js-cookie";
import ChatRoom from "src/pages/ChatRoom";
const Router = () => {
  const setIsLoggedIn = useSetRecoilState(userState);

  useEffect(() => {
    const kakaoToken = Cookies.get("kakao_token");
    const accessToken = Cookies.get("accessToken");
    const googleToken = Cookies.get("google_token");

    if (kakaoToken || accessToken || googleToken) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/chat/:id" element={<ChatRoom />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
