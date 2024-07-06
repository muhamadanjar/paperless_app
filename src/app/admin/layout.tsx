
import { AuthProvider } from "@/context/AuthProvider";
import ThemeRegistry from "@/components/ThemeRegistry";
import { ReactNode } from "react";
export function AdminLayout({ children }: {children:ReactNode}){
	return (
		<>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
		</>
	)
}