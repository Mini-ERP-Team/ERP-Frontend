import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface RoleRouteProps {
    allowedRoles: string[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!allowedRoles.includes(user.vaitro)) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />;
}

export default RoleRoute;
