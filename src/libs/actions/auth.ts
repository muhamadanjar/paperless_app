'use server';

import { signIn, signOut } from "@/libs/auth";
import { AuthError } from "next-auth";
import { Routes } from "@/configs/route.const";

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            callbackUrl: Routes.dashboards.path,
            redirect: true,
            redirectTo: Routes.dashboards.path,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function logout(formData: FormData) {
    await signOut({
        redirectTo: Routes.login.path,
    });
}

