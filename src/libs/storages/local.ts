// lib/storage/local.ts

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

export class LocalStorage {
  private uploadDir = join(process.cwd(), 'uploads');
  
  async uploadZip(file: File, organizationId: string): Promise<{
    url: string;
    size: number;
    hash: string;
  }> {
    // Create directory if not exists
    await mkdir(this.uploadDir, { recursive: true });
    
    // Generate unique filename
    const filename = `${organizationId}-${Date.now()}-${file.name}`;
    const filepath = join(this.uploadDir, filename);
    
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Calculate hash
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    
    // Save file
    await writeFile(filepath, buffer);
    
    return {
      url: `/uploads/deployments/${filename}`,
      size: buffer.length,
      hash,
    };
  }
}