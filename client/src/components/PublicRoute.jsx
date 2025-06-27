import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";

function PublicRoute({ children }) {
    const { isAuthenticated } = useAuth();

    // if (isAuthenticated) {
    //     return <Navigate to="/home" replace />;
    // }

    return children;
}

export default PublicRoute;
