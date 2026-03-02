import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}