type NameToType = {
	readonly ENV: 'production' | 'staging' | 'development' | 'test' | string;
	readonly NODE_ENV: 'production' | 'development' | string;
	readonly PORT: number;
	readonly API_URL: string;
	readonly DATABASE_URL: string;
	readonly NEXTAUTH_URL: string;
	readonly NEXTAUTH_SECRET: string;
};

export function getEnv<K extends keyof NameToType>(name: K): NameToType[K] {
	const val = process.env[name];

	if (!val) {
		throw new Error(`Cannot find environmental variable: ${name}`);
	}

	return val as unknown as NameToType[K];
}
