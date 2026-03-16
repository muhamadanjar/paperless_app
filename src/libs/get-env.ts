type NameToType = {
	readonly ENV: 'production' | 'staging' | 'development' | 'test' | string;
	readonly NODE_ENV: 'production' | 'development' | string;
	readonly PORT: number;
	readonly API_URL: string;
	readonly DATABASE_URL: string;
	readonly NEXTAUTH_URL: string;
	readonly NEXTAUTH_SECRET: string;

	// Storage — required
	readonly STORAGE_PROVIDER: 'minio' | 's3' | 'r2' | 'backblaze' | string;
	readonly STORAGE_BUCKET: string;
	readonly STORAGE_ACCESS_KEY: string;
	readonly STORAGE_SECRET_KEY: string;
	readonly STORAGE_REGION: string;
	
	// Storage — optional
	readonly STORAGE_ENDPOINT?: string;   // wajib untuk MinIO / R2 / Backblaze
	readonly STORAGE_PUBLIC_URL?: string; // custom public base URL
	readonly STORAGE_USE_PATH_STYLE?: 'true' | 'false'; // default true for MinIO
};

export function getEnv<K extends keyof NameToType>(name: K): NameToType[K] {
	const val = process.env[name];

	if (!val) {
		throw new Error(`Cannot find environmental variable: ${name}`);
	}

	return val as unknown as NameToType[K];
}
