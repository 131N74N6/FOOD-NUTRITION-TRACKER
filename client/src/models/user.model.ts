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
    profile_picture: string;
    user_id: string;
    username: string;
}