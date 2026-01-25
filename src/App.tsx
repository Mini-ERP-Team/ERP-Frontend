import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// import DashboardPage from "./pages/DashboardPage";

import { useAuthStore } from "./store/useAuthStore";
import authApi from "./api/authApi";

function App() {
  const [isChecking, setIsChecking] = useState(true);
  const { setAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Đang khôi phục phiên đăng nhập...");
        const response = await authApi.refreshToken();

        if (response.data.accessToken) {
          setAuth(response.data.user, response.data.accessToken);
          console.log("Khôi phục thành công!");
        }
      } catch {
        console.log("Không thể khôi phục (Token hết hạn hoặc chưa đăng nhập)");
      } finally {
        setIsChecking(false);
      }
    };

    initAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
