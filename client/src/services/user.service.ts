import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IUserService } from "../models/user.model";
import { useNavigate } from "react-router-dom";

export default function UserServices(props?: IUserService) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const changeUserMt = useMutation({
        mutationFn: async () => {},
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (queryKey.length > 0 && Array.isArray(query) && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`results`) ||
                        queryKey[0].startsWith(`result`) ||
                        queryKey[0].startsWith(`current-user`);
                    }
                    return false;
                }
            });
        }
    });

    const deleteUserMt = useMutation({
        mutationFn: async () => {},
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (queryKey.length > 0 && Array.isArray(query) && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`results`) ||
                        queryKey[0].startsWith(`result`) ||
                        queryKey[0].startsWith(`current-user`);
                    }
                    return false;
                }
            });
            navigate('/sign-in');
        }
    });

    const isProcessing = changeUserMt.isPending || deleteUserMt.isPending;

    return { changeUserMt, deleteUserMt, isProcessing }
}