import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectAws } from 'aws-sdk-v3-nest';
import { resolveObjectURL } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import { createReadStream, read } from 'node:fs';
import { extname } from 'node:path';

@Injectable()
export class ImageService {
  private bucket = this.cfg.get<string>('IMAGE_S3_BUCKET');
  constructor(
    @InjectAws(S3Client) private readonly s3: S3Client,
    private readonly cfg: ConfigService,
  ) {}

  async handleImage(file: Express.Multer.File) {
    const bucketFileName = randomUUID() + '.' + extname(file.filename);
    const createCommand = new CreateMultipartUploadCommand({
      Bucket: this.bucket,
      Key: bucketFileName,
    });
    const { UploadId } = await this.s3.send(createCommand);
    await new Promise<void>((res, rej) => {
      const readStream = createReadStream(file.path);
      let seq = 0;
      readStream.on('data', async (chunk) => {
        try {
          const uploadPart = new UploadPartCommand({
            UploadId,
            PartNumber: seq++,
            Body: chunk,
            Bucket: this.bucket,
            Key: bucketFileName,
          });
          await this.s3.send(uploadPart);
        } catch (err) {
          readStream.close();
          rej(err);
        }
      });
      readStream.once('end', () => res());
      readStream.once('error', (err) => rej(err));
    });
    const endCommand = new CompleteMultipartUploadCommand({
      Bucket: this.bucket,
      Key: bucketFileName,
      UploadId,
    });
    await this.s3.send(endCommand);
    return bucketFileName;
  }
}
