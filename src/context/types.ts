export type UserDataType = {
    id: string;
    email: string;
}

export type AuthContextType = {
    // left empty if unused, or remove
}

export type ErrCallbackType = (err: any) => void

export type LoginParams = {
    email: string;
    password: string;
    rememberMe: boolean;
}

export type AuthValuesType = {
    user: UserDataType | null;
    loading: boolean;
    setUser: (value: UserDataType | null) => void;
    setLoading: (value: boolean) => void;
    login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
    logout: () => void;
}