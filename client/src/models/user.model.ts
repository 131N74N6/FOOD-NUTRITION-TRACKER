export interface IAuthService {
    setMessage: (message: string | null) => void;
}

export interface ISignIn {
    username: string;
    password: string;
}

export interface ISignUp extends ISignIn {
    email: string;
}

export interface IUser {
    created_at: string;
    email: string;
    profile_picture: {
        public_id: string;
        resource_type: string;
        url: string;
    };
    user_id: string;
    username: string;
}

export interface IUserService{
    message?: string | null;
    setMessage?: (message: string | null) => void;
}