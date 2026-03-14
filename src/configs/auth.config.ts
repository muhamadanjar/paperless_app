import { NextResponse } from "next/server";
import { Routes } from "@/configs/route.const";
import { NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/utils/db";


export const authConfig = {
    callbacks: {
        async authorized({ auth, request: { url, nextUrl, headers, body } }){
            console.log("auth",auth);
            console.log("request",url);
            console.log("nextUrl",nextUrl);
            console.log("headers",headers);
            const isLoggedIn = !!auth?.user;

            if (nextUrl.pathname.startsWith('/auth')) {
                if (isLoggedIn){ 
                    return NextResponse.redirect(new URL(Routes.dashboards.path, nextUrl), {
                        status: 307,
                    });
                }
                return true;
            } else {
                if (isLoggedIn) return true;
                return NextResponse.redirect(new URL(Routes.login.path, nextUrl), {
                    status: 307,
                });
            }

        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub || '';
                session.user.avatarUrl = token.avatarUrl as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user){
                token.avatarUrl = user.avatarUrl
            }
            return token
        }

    },
    providers: [],
    // adapter: DrizzleAdapter(db),
} satisfies NextAuthConfig;
