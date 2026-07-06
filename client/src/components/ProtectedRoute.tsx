import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Loading from "./Loading";

interface IProtectedRoute {
    children: React.ReactNode;
}

export default function ProtectedRoute(props: IProtectedRoute) {
    const { isCurrentUserLoading, currentUser } = AuthService();

    if (isCurrentUserLoading) {
        return (
            <div className="flex justify-center items-center h-full bg-white">
                <Loading/>
            </div>
        );
    }

    return (
        <>{currentUser && currentUser.user_id ? <>{props.children}</> : <Navigate to={'/sign-in'}/>}</>
    );
}