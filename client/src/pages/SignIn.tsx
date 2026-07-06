import { useEffect } from "react";
import AuthService from "../services/auth.service"
import { Link, useNavigate } from "react-router-dom";
import { useMessageStore } from "../stores/message.store";
import { User2 } from "lucide-react";

export default function SignIn() {
    const navigate = useNavigate();
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { 
        currentUser, 
        isCurrentUserLoading, 
        isProcessing, 
        setSignIn, 
        signIn, 
        signInMt
    } = AuthService({ setMessage: setMessage });

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

    const handleSignIn = (event: React.SyntheticEvent) => {
        event.preventDefault();
        signInMt.mutate();
    }

    return (
        <section className="flex justify-center items-center h-screen p-2">
            <form 
                className="border border-gray-500 p-2 rounded-lg flex flex-col gap-2.5 w-80"
                onSubmit={handleSignIn}
            >
                <div className="flex justify-center"><User2 size={30}/></div>
                <div className="relative flex flex-col gap-1">
                    <label htmlFor="username">Username</label>
                    <input 
                        className="disabled:cursor-not-allowed outline-0 border border-gray-500 font-medium text-gray-500 p-2 rounded-lg w-full"
                        id="username"
                        name="username"
                        type="text" 
                        onChange={(event) => setSignIn('username', event.target.value)}
                        value={signIn.username}
                    />
                </div>
                <div className="relative flex flex-col gap-1">
                    <label htmlFor="password">Password</label>
                    <input 
                        className="disabled:cursor-not-allowed outline-0 border border-gray-500 font-medium text-gray-500 p-2 rounded-lg w-full"
                        id="password"
                        name="password"
                        type="password" 
                        onChange={(event) => setSignIn('password', event.target.value)}
                        value={signIn.password}
                    />
                </div>
                <button
                    className="disabled:cursor-not-allowed cursor-pointer bg-green-700 hover:bg-green-800 transition-colors text-white font-medium p-2 rounded-lg"
                    disabled={isProcessing}
                    type="submit"
                >
                    {isProcessing ? 'Signing In...' : 'Sign In'}
                </button>
                {isProcessing || message ? (
                    null
                ) : (
                    <div className="text-center">Don't have account ? <Link className="text-blue-600" to={'/sign-up'}>Sign Up</Link></div>
                )}
                {message ? <div className="text-red-500 text-center font-medium">{message}</div> : null}
            </form>
        </section>
    );
}