import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import { extname } from 'path';

@Injectable()
export class UploadFilePipe implements PipeTransform {
  private readonly allowedFormats = ['.jpg', '.jpeg', '.png'];
  private readonly maxSize = 2 * 1024 * 1024;

  transform(file: Express.Multer.File): Express.Multer.File {
    const fileExt = extname(file.originalname);
    const fileSize = file.size;

    if (!this.allowedFormats.includes(fileExt.toLowerCase())) {
      throw new BadRequestException('Invalid file extension');
    }

    if (fileSize > this.maxSize) {
      throw new BadRequestException('Maximum file size exceeded');
    }

    return file;
  }
}
