"use client"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

export default function ProviderWrapper({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(()=> new QueryClient())
    return (
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </QueryClientProvider>
        </AppRouterCacheProvider>
    );
}