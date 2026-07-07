import { Navigate } from "react-router-dom";
import UserServices from "../services/user.service";
import Loading from "./Loading";

interface IProtectedRoute {
    children: React.ReactNode;
}

export default function ProtectedRoute(props: IProtectedRoute) {
    const { isCurrentUserLoading, currentUser } = UserServices();

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