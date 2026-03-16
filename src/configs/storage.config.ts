import { getEnv } from '@/libs/get-env';
import type { StorageConfig } from '@/types/storage';

/**
 * Membaca environment variables dan mengembalikan StorageConfig.
 *
 * Environment variables yang diperlukan:
 *   STORAGE_PROVIDER      — "minio" | "s3" | "r2" | "backblaze" | ...
 *   STORAGE_BUCKET        — nama bucket
 *   STORAGE_REGION        — region, mis "us-east-1" atau "auto"
 *   STORAGE_ACCESS_KEY    — access key ID
 *   STORAGE_SECRET_KEY    — secret access key
 *
 * Environment variables opsional:
 *   STORAGE_ENDPOINT      — custom endpoint (wajib untuk MinIO / R2 / Backblaze)
 *   STORAGE_PUBLIC_URL    — base URL publik untuk membentuk URL download
 *   STORAGE_USE_PATH_STYLE — "true" | "false" (default: "true" untuk non-S3)
 */
export function getStorageConfig(): StorageConfig {
  const provider = getEnv('STORAGE_PROVIDER');

  // Baca env opsional tanpa melempar error jika tidak ada
  const endpoint = process.env.STORAGE_ENDPOINT || undefined;
  const publicUrl = process.env.STORAGE_PUBLIC_URL || undefined;
  const pathStyleEnv = process.env.STORAGE_USE_PATH_STYLE;

  // Default forcePathStyle: true kecuali provider adalah AWS S3 murni
  const forcePathStyle =
    pathStyleEnv !== undefined
      ? pathStyleEnv === 'true'
      : provider !== 's3';

  return {
    provider,
    bucket: getEnv('STORAGE_BUCKET'),
    region: getEnv('STORAGE_REGION'),
    accessKey: getEnv('STORAGE_ACCESS_KEY'),
    secretKey: getEnv('STORAGE_SECRET_KEY'),
    endpoint,
    publicUrl,
    forcePathStyle,
  };
}