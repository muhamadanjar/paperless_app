
import { AuthProvider } from "@/context/auth-provider";
import { ReactNode } from "react";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
export default function AdminLayout({ children }: {children:ReactNode}){
	return (
		<>
        <LayoutWrapper>
          <AuthProvider>{children}</AuthProvider>
        </LayoutWrapper>
		</>
	)
}