import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import authApi from "../api/authApi";

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await authApi.logout();
    } catch {
    }

    try {
      localStorage.setItem("auth:loggedOut", "1");
    } catch {
    }

    logout();
    navigate("/login");
  };

  const allMenuItems = [
    { icon: "dashboard", label: "Dashboard", path: "/dashboard" },
    { icon: "inventory_2", label: "Products", path: "/products" },
    { icon: "groups", label: "Customers", path: "/customers" },
    { icon: "local_shipping", label: "Suppliers", path: "/suppliers" },
    { icon: "person", label: "Users", path: "/users" },
    { icon: "warehouse", label: "Inventory", path: "/inventory" },
    { icon: "receipt_long", label: "Sales", path: "/sales" },
    { icon: "publish", label: "Imports", path: "/imports" },
  ];

  const menuItems = allMenuItems.filter(item => {
    if (user?.vaitro.toUpperCase() === 'ADMIN' && item.path === '/sales') {
      return false;
    }

    if (user?.vaitro.toUpperCase() === 'STAFF' && item.path === '/users') {
      return false;
    }
    return true
  })

  return (
    <aside className="flex h-full w-64 flex-col border-r border-card-dark bg-[#111418] flex-shrink-0 transition-all duration-300">
      <div className="flex flex-col h-full p-4">
        <div className="flex gap-3 mb-8 px-2">
          <div className="bg-primary/20 flex items-center justify-center rounded-lg size-10 overflow-hidden">
            <img
              src="/logo.png"
              alt="Company logo"
              className="h-full w-full object-contain "
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-white text-base font-bold leading-tight">
              Retail Manager
            </h1>
            <p className="text-text-secondary text-xs font-normal">
              Internal System
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-card-dark hover:text-white"
                }`
              }
            >
              <span
                className={`material-symbols-outlined ${item.path === "/dashboard" ? "filled" : ""}`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-card-dark">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-card-dark hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#fa6238] hover:bg-[#fa6238]/10 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
