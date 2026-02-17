import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuthstore } from "./store/auth";
import Protected from "./routes/Protected";
import Dashboardlayout from "./layouts/Dashboardlayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cars from "./pages/Cars";
import Users from "./pages/Users";

function AuthListener() {
  const navigate = useNavigate();
  const logout = useAuthstore((s) => s.logout);

  useEffect(() => {
    const handleLogout = () => {
      logout();
      navigate("/login", { replace: true });
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [logout, navigate]);

  return null;
}

function App() {
  return (
    <>
      <AuthListener />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Protected>
              <Dashboardlayout />
            </Protected>
          }
        >
          <Route index element={<Navigate to="/cars" replace />} />
          <Route path="cars" element={<Cars />} />
          <Route path="users" element={<Users />} />
          <Route path="*" element={<Navigate to="/cars" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
