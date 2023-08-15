import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import * as process from 'process';
import { v4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
  });

  async uploadFile(
    file: Express.Multer.File,
    itemType: string,
    itemId: string,
  ): Promise<string> {
    const filePath = this.buildPath(file.originalname, itemType, itemId);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: process.env.AWS_S3_ACL,
      }),
    );
    return filePath;
  }

  async deleteFile(filePath: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: filePath,
      }),
    );
  }
  private buildPath(
    fileName: string,
    itemType: string,
    itemId: string,
  ): string {
    return `${itemType}/${itemId}/${v4()}${extname(fileName)}`;
  }
}
