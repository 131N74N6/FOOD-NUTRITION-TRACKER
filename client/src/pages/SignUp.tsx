import { useEffect } from "react";
import AuthService from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { useMessageStore } from "../stores/message.store";
import { User2 } from "lucide-react";
import UserServices from "../services/user.service";

export default function SignUp() {
    const navigate = useNavigate();
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const { currentUser, isCurrentUserLoading } = UserServices();
    const { isProcessing, setSignUp, signUp, signUpMt } = AuthService({ setMessage: setMessage });

    useEffect(() => {
        if (currentUser && currentUser.user_id && !isCurrentUserLoading) {
            navigate('/histories');
        }
    }, [currentUser, isCurrentUserLoading, currentUser?.user_id]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const handleSignUp = (event: React.SyntheticEvent) => {
        event.preventDefault();
        signUpMt.mutate();
    }

    return (
        <section className="flex justify-center items-center h-screen p-2">
            <form
                className="border border-gray-500 p-2 rounded-lg flex flex-col gap-2.5 w-80"
                onSubmit={handleSignUp}
            >
                <div className="flex justify-center"><User2 size={30}/></div>
                <div className="relative flex flex-col gap-1.5">
                    <label htmlFor="email">Email</label>
                    <input 
                        className="disabled:cursor-not-allowed outline-0 border border-gray-500 font-medium text-gray-500 p-2 rounded-lg w-full"
                        id="email"
                        name="email"
                        type="email" 
                        onChange={(event) => setSignUp('email', event.target.value)}
                        value={signUp.email}
                    />
                </div>
                <div className="relative flex flex-col gap-1.5">
                    <label htmlFor="password">Password</label>
                    <input 
                        className="disabled:cursor-not-allowed outline-0 border border-gray-500 font-medium text-gray-500 p-2 rounded-lg w-full"
                        id="password"
                        name="password"
                        type="password" 
                        onChange={(event) => setSignUp('password', event.target.value)}
                        value={signUp.password}
                    />
                </div>
                <div className="relative flex flex-col gap-1.5">
                    <label htmlFor="username">Username</label>
                    <input 
                        className="disabled:cursor-not-allowed outline-0 border border-gray-500 font-medium text-gray-500 p-2 rounded-lg w-full"
                        id="username"
                        name="username"
                        type="text" 
                        onChange={(event) => setSignUp('username', event.target.value)}
                        value={signUp.username}
                    />
                </div>
                <button
                    className="disabled:cursor-not-allowed cursor-pointer bg-green-700 hover:bg-green-800 transition-colors text-white font-medium p-2 rounded-lg"
                    disabled={isProcessing}
                    type="submit"
                >
                    {isProcessing ? 'Signing Up...' : 'Sign Up'}
                </button>
                {isProcessing ? (
                    null 
                ) : (
                    <div className="text-center">Already have account ? <Link className="text-blue-600" to={'/sign-in'}>Sign In</Link></div>
                )}
                {message ? <div className="text-red-500 text-center font-medium">{message}</div> : null}
            </form>
        </section>
    );
}