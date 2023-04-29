import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { S3Client } from '@aws-sdk/client-s3';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    AwsSdkModule.register({
      client: new S3Client({
        region: 'sa-east-1',
      }),
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
