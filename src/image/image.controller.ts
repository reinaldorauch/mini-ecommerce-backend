import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('image'))
  uploadFile(@UploadedFiles() file: Express.Multer.File[]) {
    this.imageService.handleImage(image);
  }
}
