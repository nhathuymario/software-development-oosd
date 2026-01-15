import { Navigate } from "react-router-dom";
import { hasRole, isAuthenticated } from "../services/auth";
import type { JSX } from "react";

interface Props {
    role?: string;
    children: JSX.Element;
}

const ProtectedRoute = ({ role, children }: Props) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (role && !hasRole(role)) {
        return <Navigate to="/403" />;
    }

    return children;
};

export default ProtectedRoute;
