import { useEffect, useRef, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { useAuthStore } from "./store/useAuthStore";
import authApi from "./api/authApi";
import AppRoutes from "./routes/AppRoutes";


function App() {
  const [isChecking, setIsChecking] = useState(true);
  const { setAuth, isAuthenticated } = useAuthStore();
  const didInitAuth = useRef(false);

  useEffect(() => {
    if (didInitAuth.current) return;
    didInitAuth.current = true;

    const initAuth = async () => {
      try {
        if (localStorage.getItem("auth:loggedOut") === "1") {
          return;
        }
      } catch {
      }

      try {
        console.log("Đang khôi phục phiên đăng nhập...");
        const response = await authApi.refreshToken();

        if (response.data.accessToken) {
          setAuth(response.data.user, response.data.accessToken);
          try {
            localStorage.removeItem("auth:loggedOut");
          } catch {
          }
          console.log("Khôi phục thành công!");
          console.log(useAuthStore.getState().user?.idnguoidung);
        }
      } catch {
        console.log("Không thể khôi phục (Token hết hạn hoặc chưa đăng nhập)");
      } finally {
        setIsChecking(false);
      }
    };

    initAuth();
  }, [setAuth]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes isAuthenticated={isAuthenticated} />
    </BrowserRouter>
  );
}

export default App;
