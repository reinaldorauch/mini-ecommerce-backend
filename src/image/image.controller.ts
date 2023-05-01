import {
  Controller,
  Logger,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TokenGuard } from '../auth/token.guard';
import { IsAdminGuard } from '../auth/is-admin.guard';
import { ConfigService } from '@nestjs/config';

@Controller('image')
export class ImageController {
  #logger = new Logger(ImageController.name);
  isProd = this.cfg.get<string>('NODE_ENV') === 'production';

  constructor(
    private readonly imageService: ImageService,
    private readonly cfg: ConfigService,
  ) {}

  @Post('upload')
  @UseGuards(TokenGuard, IsAdminGuard)
  @UseInterceptors(FilesInterceptor('image'))
  async uploadFile(@UploadedFiles() files: Express.Multer.File[] = []) {
    if (!this.isProd) {
      this.#logger.debug(
        'Got these files: ' + JSON.stringify(files, undefined, 2),
      );
    }

    return Promise.all(files.map((f) => this.imageService.handleImage(f)));
  }
}
