import type { ObjectCannedACL } from '@aws-sdk/client-s3';

// ─── Storage Provider Types ───────────────────────────────────────────────────

/** Provider yang didukung. Tambah entri jika ingin mendukung provider baru. */
export type StorageProvider = 'minio' | 's3' | 'r2' | 'backblaze' | (string & {});

// ─── Config ───────────────────────────────────────────────────────────────────

export interface StorageConfig {
  /** Nama provider, hanya digunakan untuk referensi / logging. */
  provider: StorageProvider;

  /** Bucket default. Bisa di-override per-upload lewat UploadOptions. */
  bucket: string;

  /** Region bucket, mis: "us-east-1" atau "auto" untuk Cloudflare R2. */
  region: string;

  /** Access Key ID. */
  accessKey: string;

  /** Secret Access Key. */
  secretKey: string;

  /**
   * Custom endpoint URL.
   * Wajib untuk MinIO, Cloudflare R2, Backblaze B2, dsb.
   * Opsional untuk AWS S3 asli (akan pakai endpoint default SDK).
   */
  endpoint?: string;

  /**
   * Base URL publik untuk membentuk URL download.
   * Contoh MinIO: "https://storage.example.com"
   * Contoh AWS:   "https://<bucket>.s3.<region>.amazonaws.com"
   * Jika tidak di-set, URL dibentuk dari endpoint + bucket + key.
   */
  publicUrl?: string;

  /**
   * Gunakan path-style URL: `endpoint/bucket/key`
   * Wajib true untuk MinIO.
   * Default: true jika provider !== 's3'.
   */
  forcePathStyle?: boolean;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

/** ACL yang umum didukung S3-compatible. Re-export dari ObjectCannedACL SDK. */
export type StorageACL = ObjectCannedACL;

export interface UploadOptions {
  /**
   * Custom object key (path di dalam bucket).
   * Jika tidak di-set, key di-generate otomatis dari `folder/uuid-filename`.
   */
  key?: string;

  /** Bucket override. Jika tidak di-set, gunakan bucket dari config. */
  bucket?: string;

  /** MIME type file. Jika tidak di-set, di-detect dari ekstensi atau fallback ke `application/octet-stream`. */
  contentType?: string;

  /** ACL S3. Biarkan kosong jika bucket menggunakan Block Public Access. */
  acl?: StorageACL;

  /** Cache-Control header, mis: "public, max-age=31536000". */
  cacheControl?: string;

  /** Metadata kustom (key-value string). */
  metadata?: Record<string, string>;
}

// ─── Result ───────────────────────────────────────────────────────────────────

export interface UploadResult {
  /** URL publik untuk mengakses file. */
  url: string;

  /** Object key di dalam bucket (path). */
  key: string;

  /** Bucket tempat file di-upload. */
  bucket: string;

  /** MIME type file yang di-upload. */
  contentType: string;

  /** Ukuran file dalam bytes. */
  size: number;
}

export interface DeleteResult {
  success: boolean;
  key: string;
  bucket: string;
}

export interface FileExistsResult {
  exists: boolean;
  key: string;
  bucket: string;
}
