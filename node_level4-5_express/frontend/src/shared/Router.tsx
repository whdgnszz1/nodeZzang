import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "src/pages/Login";
import Main from "src/pages/Main";
import Signup from "src/pages/Signup";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
