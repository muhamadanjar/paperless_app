/**
 * Unified Storage Entry Point
 *
 * @example — Singleton (direkomendasikan)
 * import { storage } from '@/libs/storages';
 *
 * const result = await storage.uploadFile(file, 'avatars');
 * await storage.deleteFile(result.key);
 *
 * @example — Custom instance
 * import { S3Storage } from '@/libs/storages';
 *
 * const storage = S3Storage.fromConfig({ provider: 'minio', ... });
 */

export { S3Storage, storage } from './s3-storage';

export type {
  StorageConfig,
  StorageProvider,
  StorageACL,
  UploadOptions,
  UploadResult,
  DeleteResult,
  FileExistsResult,
} from '@/types/storage';
