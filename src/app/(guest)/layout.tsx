import ThemeRegistry from "@/components/ui/theme-registry";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<ThemeRegistry>
				{children}
			</ThemeRegistry>
		</>
	)
}