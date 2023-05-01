import { Logger, Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { S3Client } from '@aws-sdk/client-s3';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    AwsSdkModule.registerAsync({
      clientType: S3Client,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService): S3Client =>
        new S3Client({
          region: cfg.get<string>('IMAGE_S3_REGION'),
          credentials: {
            accessKeyId: cfg.get<string>('IMAGE_S3_KEY_ID'),
            secretAccessKey: cfg.get<string>('IMAGE_S3_ACCESS_KEY'),
          },
        }),
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
