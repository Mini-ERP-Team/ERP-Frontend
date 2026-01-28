import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useLocation, useSearchParams } from "react-router-dom";

const routeTitle = (pathname: string) => {
  if (pathname === "/dashboard") return "Dashboard Overview";
  if (pathname === "/products") return "Products Overview";
  if (pathname === "/customers") return "Customers Overview";
  if (pathname === "/suppliers") return "Suppliers Overview";
  if (pathname === "/users") return "Users Overview";
  if (pathname === "/inventory") return "Inventory Overview";
  if (pathname === "/imports") return "Imports Overview";
  if (pathname === "/sales") return "Sales Orders Overview";
  if (pathname === "/sales/new") return "Create Sales Order";
  return "Retail Manager System";
};

const Header = ({ title }: { title?: string }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const computedTitle = title ?? routeTitle(location.pathname);
  const [searchParams, setSearchParams] = useSearchParams();

  const supportsHeaderSearch = useMemo(() => {
    const p = location.pathname;
    return (
      p === "/products" ||
      p === "/customers" ||
      p === "/sales" ||
      p === "/inventory" ||
      p === "/imports" ||
      p === "/suppliers" ||
      p === "/users"
    );
  }, [location.pathname]);

  const urlQuery = searchParams.get("q") ?? "";
  const [draftQuery, setDraftQuery] = useState(urlQuery);

  useEffect(() => {
    // Keep input in sync when navigating / when other page inputs update ?q=
    setDraftQuery(urlQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery, location.pathname]);

  useEffect(() => {
    if (!supportsHeaderSearch) return;

    const t = window.setTimeout(() => {
      const next = new URLSearchParams(location.search);
      const q = draftQuery.trim();
      if (q) next.set("q", q);
      else next.delete("q");
      setSearchParams(next, { replace: true });
    }, 250);

    return () => window.clearTimeout(t);
  }, [draftQuery, supportsHeaderSearch, location.search, setSearchParams]);

  return (
    <header className="flex items-center justify-between border-b border-card-dark bg-[#111418] px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
          {computedTitle}
        </h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center relative w-64 lg:w-96">
          <div className="absolute left-3 text-text-secondary">
            <span className="material-symbols-outlined text-[20px]">
              search
            </span>
          </div>
          <input
            className="w-full bg-card-dark border-none rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Search orders, products..."
            value={draftQuery}
            onChange={(e) => setDraftQuery(e.target.value)}
            disabled={!supportsHeaderSearch}
          />
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-card-dark">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">
              {user?.hoten || "User"}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {user?.vaitro || "Guest"}
            </p>
          </div>
          <div className="bg-primary/20 flex items-center justify-center rounded-full size-10 border border-card-dark text-primary font-bold">
            {user?.hoten?.charAt(0) || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
