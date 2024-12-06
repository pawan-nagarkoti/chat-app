import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ChatPage, LoginPage, RegisterPage } from "./pages";
import { useEffect } from "react";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login");
    }
  }, [location]);
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </>
  );
}
