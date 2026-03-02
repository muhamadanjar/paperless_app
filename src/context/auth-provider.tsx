"use client";
import { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  AuthValuesType,
  LoginParams,
  ErrCallbackType,
  UserDataType,
} from "./types";

const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  	const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  	const [loading, setLoading] = useState<boolean>(defaultProvider.loading);

  	const router = useRouter();


  	const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post("/auth/me", params)
      .then(async (response) => {
        params.rememberMe
          ? window.localStorage.setItem(
              "accessToken",
              response.data.accessToken
            )
          : null;
        const returnUrl = "/";

        setUser({ ...response.data.userData });
        params.rememberMe
          ? window.localStorage.setItem(
              "userData",
              JSON.stringify(response.data.userData)
            )
          : null;

        const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";

        router.replace(redirectURL as string);
      })

      .catch((err) => {
        if (errorCallback) errorCallback(err);
      });
  	}

	const handleLogout = () => {
		setUser(null);
		window.localStorage.removeItem("userData");
		window.localStorage.removeItem("accessToken");
		router.push("/login");
	};


	const values = {
		user,
		loading,
		setUser,
		setLoading,
		login: handleLogin,
		logout: handleLogout,
	};

  	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
