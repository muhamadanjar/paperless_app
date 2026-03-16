import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import { randomUUID } from 'crypto';

import { getStorageConfig } from '@/configs/storage.config';
import type {
  StorageConfig,
  UploadOptions,
  UploadResult,
  DeleteResult,
  FileExistsResult,
} from '@/types/storage';

// ─── MIME Type Map ────────────────────────────────────────────────────────────

const MIME_TYPE_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.webm': 'video/webm',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

// ─── S3Storage Class ──────────────────────────────────────────────────────────

/**
 * S3Storage — Unified S3-compatible object storage client.
 *
 * Kompatibel dengan: MinIO, AWS S3, Cloudflare R2, Backblaze B2,
 * dan semua provider yang mengimplementasikan S3 API.
 *
 * Konfigurasi dibaca dari environment variables melalui `getStorageConfig()`.
 *
 * @example
 * // Gunakan singleton instance (direkomendasikan)
 * import { storage } from '@/libs/storages';
 *
 * const result = await storage.upload.file(file, 'avatars');
 * await storage.delete(result.key);
 *
 * @example
 * // Atau buat instance dengan config custom
 * const storage = S3Storage.fromConfig({ provider: 'minio', ... });
 */
export class S3Storage {
  private readonly client: S3Client;
  readonly config: StorageConfig;

  // ─── Constructor ────────────────────────────────────────────────────────────

  constructor(config: StorageConfig) {
    this.config = config;
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
      ...(config.endpoint && { endpoint: config.endpoint }),
      forcePathStyle: config.forcePathStyle ?? true,
    });
  }

  // ─── Static Factory Methods ─────────────────────────────────────────────────

  /**
   * Buat instance dari environment variables.
   * Gunakan ini untuk membuat instance custom (bukan singleton).
   */
  static fromEnv(): S3Storage {
    return new S3Storage(getStorageConfig());
  }

  /**
   * Buat instance dari config object secara langsung.
   */
  static fromConfig(config: StorageConfig): S3Storage {
    return new S3Storage(config);
  }

  // ─── Singleton ──────────────────────────────────────────────────────────────

  private static _instance: S3Storage | null = null;

  /**
   * Mengembalikan singleton instance.
   * Config dibaca sekali dari env vars dan di-cache selama proses berjalan.
   */
  static getInstance(): S3Storage {
    if (!S3Storage._instance) {
      S3Storage._instance = S3Storage.fromEnv();
    }
    return S3Storage._instance;
  }

  /**
   * Reset singleton (berguna untuk testing / hot-reload).
   */
  static resetInstance(): void {
    S3Storage._instance = null;
  }

  // ─── Upload ─────────────────────────────────────────────────────────────────

  /**
   * Upload dari Buffer atau Uint8Array.
   *
   * @example
   * const result = await storage.uploadBuffer(buffer, 'document.pdf', 'docs');
   */
  async uploadBuffer(
    buffer: Buffer | Uint8Array,
    filename: string,
    folder?: string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const bucket = options.bucket ?? this.config.bucket;
    const key = options.key ?? this.generateKey(filename, folder);
    const contentType = options.contentType ?? this.detectContentType(filename);

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ContentLength: buffer.byteLength,
        ...(options.acl && { ACL: options.acl }),
        ...(options.cacheControl && { CacheControl: options.cacheControl }),
        ...(options.metadata && { Metadata: options.metadata }),
      }),
    );

    return {
      url: this.buildPublicUrl(key, bucket),
      key,
      bucket,
      contentType,
      size: buffer.byteLength,
    };
  }

  /**
   * Upload dari objek File (browser) atau Blob.
   *
   * @example
   * const result = await storage.uploadFile(event.target.files[0], 'avatars');
   */
  async uploadFile(
    file: File | Blob,
    folder?: string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const filename = file instanceof File ? file.name : `blob-${Date.now()}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = options.contentType ?? (file.type || this.detectContentType(filename));

    return this.uploadBuffer(buffer, filename, folder, { ...options, contentType });
  }

  /**
   * Upload dari ReadableStream Node.js.
   * Cocok untuk file besar yang di-stream dari endpoint lain.
   *
   * @example
   * const result = await storage.uploadStream(req, 'report.pdf', 'reports');
   */
  async uploadStream(
    stream: NodeJS.ReadableStream,
    filename: string,
    folder?: string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) =>
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)),
      );
      stream.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          resolve(await this.uploadBuffer(buffer, filename, folder, options));
        } catch (err) {
          reject(err);
        }
      });
      stream.on('error', reject);
    });
  }

  /**
   * Upload dari base64 string (dengan atau tanpa data URI prefix).
   *
   * @example
   * const result = await storage.uploadBase64(dataUrl, 'signature.png', 'signatures');
   */
  async uploadBase64(
    base64: string,
    filename: string,
    folder?: string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const mimeMatch = base64.match(/^data:([^;]+);base64,/);
    const raw = base64.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(raw, 'base64');
    const contentType =
      options.contentType ?? mimeMatch?.[1] ?? this.detectContentType(filename);

    return this.uploadBuffer(buffer, filename, folder, { ...options, contentType });
  }

  // ─── Delete ─────────────────────────────────────────────────────────────────

  /**
   * Hapus objek dari bucket berdasarkan key.
   *
   * @example
   * await storage.deleteFile('avatars/550e8400-avatar.jpg');
   */
  async deleteFile(key: string, bucket?: string): Promise<DeleteResult> {
    const targetBucket = bucket ?? this.config.bucket;

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: targetBucket,
        Key: key,
      }),
    );

    return { success: true, key, bucket: targetBucket };
  }

  // ─── Existence Check ────────────────────────────────────────────────────────

  /**
   * Cek apakah objek ada di bucket tanpa mendownload isinya.
   *
   * @example
   * const { exists } = await storage.fileExists('reports/report.pdf');
   */
  async fileExists(key: string, bucket?: string): Promise<FileExistsResult> {
    const targetBucket = bucket ?? this.config.bucket;

    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: targetBucket,
          Key: key,
        }),
      );
      return { exists: true, key, bucket: targetBucket };
    } catch {
      return { exists: false, key, bucket: targetBucket };
    }
  }

  // ─── Presigned URLs ─────────────────────────────────────────────────────────

  /**
   * Buat presigned URL untuk download (GET) yang aman.
   * URL hanya valid selama `expiresIn` detik (default: 1 jam).
   *
   * @example
   * const url = await storage.presignedDownloadUrl('private/report.pdf');
   */
  async presignedDownloadUrl(
    key: string,
    expiresIn = 3600,
    bucket?: string,
  ): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: bucket ?? this.config.bucket,
        Key: key,
      }),
      { expiresIn },
    );
  }

  /**
   * Buat presigned URL untuk upload (PUT) langsung dari browser.
   * URL hanya valid selama `expiresIn` detik (default: 15 menit).
   *
   * @example
   * const { url, key } = await storage.presignedUploadUrl('photo.jpg', 'avatars');
   * // Di browser: fetch(url, { method: 'PUT', body: file })
   */
  async presignedUploadUrl(
    filename: string,
    folder?: string,
    expiresIn = 900,
    options: Pick<UploadOptions, 'bucket' | 'contentType' | 'key'> = {},
  ): Promise<{ url: string; key: string; bucket: string }> {
    const targetBucket = options.bucket ?? this.config.bucket;
    const key = options.key ?? this.generateKey(filename, folder);
    const contentType = options.contentType ?? this.detectContentType(filename);

    const url = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: targetBucket,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn },
    );

    return { url, key, bucket: targetBucket };
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  /**
   * Membuat object key dari folder + UUID + nama file yang di-sanitize.
   * Contoh: "avatars/550e8400-e29b-41d4-a716-446655440000-my-photo.jpg"
   */
  generateKey(filename: string, folder?: string): string {
    const ext = path.extname(filename);
    const base = path
      .basename(filename, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60);

    const uniqueName = `${randomUUID()}-${base}${ext}`;
    return folder ? `${folder.replace(/\/+$/, '')}/${uniqueName}` : uniqueName;
  }

  /**
   * Membentuk URL publik untuk mengakses objek.
   *
   * Prioritas:
   *  1. config.publicUrl  → `<publicUrl>/<key>`
   *  2. config.endpoint   → `<endpoint>/<bucket>/<key>`  (path-style, untuk MinIO)
   *  3. AWS default       → `https://<bucket>.s3.<region>.amazonaws.com/<key>`
   */
  buildPublicUrl(key: string, bucket?: string): string {
    const targetBucket = bucket ?? this.config.bucket;

    if (this.config.publicUrl) {
      const base = this.config.publicUrl.replace(/\/+$/, '');
      return `${base}/${key}`;
    }

    if (this.config.endpoint) {
      const base = this.config.endpoint.replace(/\/+$/, '');
      return `${base}/${targetBucket}/${key}`;
    }

    return `https://${targetBucket}.s3.${this.config.region}.amazonaws.com/${key}`;
  }

  /**
   * Deteksi MIME type dari ekstensi file.
   * Fallback ke `application/octet-stream` jika tidak dikenali.
   */
  private detectContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    return MIME_TYPE_MAP[ext] ?? 'application/octet-stream';
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

/**
 * Singleton instance siap pakai.
 * Config dibaca lazy (pertama kali digunakan) dari environment variables.
 *
 * @example
 * import { storage } from '@/libs/storages';
 *
 * const result = await storage.uploadFile(file, 'avatars');
 */
export const storage = S3Storage.getInstance();