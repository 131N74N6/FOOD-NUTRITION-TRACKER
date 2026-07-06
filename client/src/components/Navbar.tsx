import { DoorOpenIcon, HistoryIcon, Menu, SearchAlertIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useState } from "react";

export default function Navbar(isProcessing: boolean) {
    const navigate = useNavigate();
    const { signOutMt } = AuthService();
    const [openNavbar, setOpenNavbar] = useState(false);

    const navbarToggle = () => setOpenNavbar(!openNavbar);

    const moveTo = (route: string) => {
        navigate(route);
        setOpenNavbar(false);
    }

    return (
        <>
            <nav className="p-2.5 md:flex md:flex-col gap-2.5 md:w-1/4 hidden font-mono bg-olive-600 text-white font-medium">
                <button
                    className="cursor-pointer disabled:cursor-not-allowed text-left font-medium text-white hover:bg-olive-500 transition-colors text-[1rem] flex gap-1.5 p-2"
                    disabled={isProcessing}
                    onClick={() => navigate('/analyze')}
                >
                    <SearchAlertIcon size={24}/>
                    Analyze
                </button>
                <button
                    className="cursor-pointer disabled:cursor-not-allowed text-left font-medium text-white hover:bg-olive-500 transition-colors text-[1rem] flex gap-1.5 p-2"
                    disabled={isProcessing}
                    onClick={() => navigate('/histories')}
                >
                    <HistoryIcon size={24}/>
                    Histories
                </button>
                <button
                    className="cursor-pointer disabled:cursor-not-allowed text-left font-medium text-white hover:bg-olive-500 transition-colors text-[1rem] flex gap-1.5 p-2"
                    disabled={isProcessing}
                    onClick={() => navigate('/profile')}
                >
                    <User size={24}/>
                    Profile
                </button>
                <button
                    className="cursor-pointer disabled:cursor-not-allowed text-left font-medium text-white hover:bg-olive-500 transition-colors text-[1rem] flex gap-1.5 p-2"
                    disabled={isProcessing}
                    onClick={() => signOutMt.mutate()}
                >
                    <DoorOpenIcon size={24}/>
                    Sign Out
                </button>
            </nav>

            <nav className="md:hidden bg-olive-600 flex items-center p-4">
                <button
                    className="cursor-pointer disabled:cursor-not-allowed text-left font-medium text-white text-[1rem]"
                    disabled={isProcessing}
                    onClick={navbarToggle}
                >
                    <Menu size={24}/>
                </button>
            </nav>

            <aside className={`
                text-white fixed top-14 right-0 h-[92%] w-full bg-olive-600 z-50 transform transition-transform 
                duration-300 ease-in-out ${openNavbar ? 'translate-x-0' : 'translate-x-full'} flex flex-col gap-4 p-4
            `}>
                <button
                    className="cursor-pointer disabled:cursor-not-allowed text-left font-medium text-white hover:bg-olive-500 transition-colors text-[1rem] flex gap-1.5 p-2"
                    disabled={isProcessing}
                    onClick={() => moveTo('/analyze')}
                >
                    <SearchAlertIcon size={24}/>
                    Analyze
                </button>
                <button
                    className="cursor-pointer disabled:cursor-not-allowed text-left font-medium text-white hover:bg-olive-500 transition-colors text-[1rem] flex gap-1.5 p-2"
                    disabled={isProcessing}
                    onClick={() => moveTo('/histories')}
                >
                    <HistoryIcon size={24}/>
                    Histories
                </button>
                <button
                    className="cursor-pointer disabled:cursor-not-allowed text-left font-medium text-white hover:bg-olive-500 transition-colors text-[1rem] flex gap-1.5 p-2"
                    disabled={isProcessing}
                    onClick={() => moveTo('/profile')}
                >
                    <User size={24}/>
                    Profile
                </button>
                <button
                    className="cursor-pointer disabled:cursor-not-allowed text-left font-medium text-white hover:bg-olive-500 transition-colors text-[1rem] flex gap-1.5 p-2"
                    disabled={isProcessing}
                    onClick={() => signOutMt.mutate()}
                >
                    <DoorOpenIcon size={24}/>
                    Sign Out
                </button>
            </aside>
        </>
    );
}