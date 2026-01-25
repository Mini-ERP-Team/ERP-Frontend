import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

const MainLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen w-full flex">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header title="Dashboard Overview" />
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
            <Outlet />
          </div>
          <div className="text-center text-text-secondary text-xs py-4">
            © 2026 Retail Manager System
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
