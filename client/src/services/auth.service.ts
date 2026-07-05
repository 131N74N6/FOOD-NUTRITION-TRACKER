import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ISignIn, ISignUp, IUser } from "../models/user.model";
import DataService from "./data.service";
import { useMessageStore } from "../stores/message.store";
import { useNavigate } from "react-router-dom";

export default function AuthService() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { insertData } = DataService();
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

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
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        retry: false
    });

    const signInMt = useMutation({
        mutationFn: async (props: ISignIn) => {
            await insertData<ISignIn>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/auths/sign-in`,
                data: {
                    password: props.password.trim(),
                    username: props.username.trim()
                }
            });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            navigate('/histories');
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
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.setQueryData(['current-user'], null);
            queryClient.clear();
            navigate('/sign-in');
        },
    });

    const signUpMt = useMutation({
        mutationFn: async (props: ISignUp) => {
            await insertData<ISignUp>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/auths/register`,
                data: {
                    email: props.email.trim(),
                    password: props.password.trim(),
                    username: props.username.trim()
                }
            });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            navigate('/sign-in');
        },
    });

    const isProcessing = signInMt.isPending || signUpMt.isPending;

    return {
        currentUserError, currentUser, isCurrentUserLoading, isProcessing, message, signInMt, signOutMt, signUpMt
    }
}