import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IAuthService, ISignIn, ISignUp, IUser } from "../models/user.model";
import DataService from "./data.service";
import { useNavigate } from "react-router-dom";
import { useUserrStore } from "../stores/user.store";

export default function AuthService(props?: IAuthService) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { insertData } = DataService();

    const signIn = useUserrStore((state) => state.signIn);
    const setSignIn = useUserrStore((state) => state.setSignIn);
    const resetSignIn = useUserrStore((state) => state.resetSignIn);

    const signUp = useUserrStore((state) => state.signUp);
    const setSignUp = useUserrStore((state) => state.setSignUp);
    const resetSignUp = useUserrStore((state) => state.resetSignUp);

    const { data: currentUser, error: currentUserError, isLoading: isCurrentUserLoading } = useQuery<IUser | null>({
        queryKey: ['current-user'],
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/show`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET'
                });

                if (!request.ok) return null;
                return await request.json();
            } catch (error) {
                return null;
            }
        },
        retry: false,
        staleTime: Infinity
    });

    const signInMt = useMutation({
        mutationFn: async () => {
            await insertData<ISignIn>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/auths/sign-in`,
                data: {
                    password: signIn.password.trim(),
                    username: signIn.username.trim()
                }
            });
        },
        onError: (error) => {
            props?.setMessage(error.message);
            navigate('/sign-in');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            navigate('/histories');
            resetSignIn();
        },
    });

    const signOutMt = useMutation({
        mutationFn: async () => {
            await insertData({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/auths/sign-out`,
                data: {}
            });
        },
        onError: (error) => {
            props?.setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.setQueryData(['current-user'], null);
            queryClient.clear();
            resetSignIn();
            resetSignUp();
            navigate('/sign-in');
        },
    });

    const signUpMt = useMutation({
        mutationFn: async () => {
            await insertData<ISignUp>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/auths/sign-up`,
                data: {
                    email: signUp.email.trim(),
                    password: signUp.password.trim(),
                    username: signUp.username.trim()
                }
            });
        },
        onError: (error) => {
            props?.setMessage(error.message);
        },
        onSuccess: () => {
            resetSignUp();
            navigate('/histories');
        },
    });

    const isProcessing = signInMt.isPending || signUpMt.isPending;

    return {
        currentUserError, currentUser, isCurrentUserLoading, isProcessing, navigate, 
        setSignIn, setSignUp, signIn, signUp, signInMt, signOutMt, signUpMt
    }
}