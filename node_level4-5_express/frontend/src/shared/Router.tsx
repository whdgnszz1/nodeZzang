import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "src/pages/Login";
import Main from "src/pages/Main";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
