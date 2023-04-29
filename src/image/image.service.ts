import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  constructor(@InjectAws(S3Client) private readonly s3: S3Client) {}
}
