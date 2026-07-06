import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IAuthService, IUser } from "../models/user.model";
import { useNavigate } from "react-router-dom";
import { useUserrStore } from "../stores/user.store";

export default function AuthService(props?: IAuthService) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/sign-in`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify({
                        password: signIn.password.trim(),
                        username: signIn.username.trim()
                    })
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error: any) {
                throw error;
            }
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
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/sign-out`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST'
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error: any) {
                throw error;
            }
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
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/sign-up`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify({
                        email: signUp.email.trim(),
                        password: signUp.password.trim(),
                        username: signUp.username.trim()
                    })
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error: any) {
                throw error;
            }
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