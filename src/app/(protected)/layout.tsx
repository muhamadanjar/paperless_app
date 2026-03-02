
import { AuthProvider } from "@/context/auth-provider";
import ThemeRegistry from "@/components/theme-registry";
import { ReactNode } from "react";
export default function AdminLayout({ children }: {children:ReactNode}){
	return (
		<>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
		</>
	)
}