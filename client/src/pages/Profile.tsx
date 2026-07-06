import Navbar from "../components/Navbar";
import AuthService from "../services/auth.service";
import UserServices from "../services/user.service";

export default function Profile() {
    const { currentUser } = AuthService();
    const { isProcessing } = UserServices();

    return (
        <section className="flex md:flex-row flex-col h-screen relative">
            {Navbar(isProcessing)}
            <div className="w-full md:w-3/4 flex flex-col gap-2.5 h-full overflow-y-auto p-2.5">
                <div>Created At: {new Date(currentUser?.created_at!).toLocaleString()}</div>
                <div>User ID: {currentUser?.user_id}</div>
                <div>Username: {currentUser?.username}</div>
            </div>
        </section>
    );
}