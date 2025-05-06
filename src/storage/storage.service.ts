import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface StorageConfig {
  bucket: string;
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private config: StorageConfig;

  constructor(private configService: ConfigService) {
    const bucket = this.configService.get<string>('storage.bucket');
    const endpoint = this.configService.get<string>('storage.endpoint');
    const region = this.configService.get<string>('storage.region');
    const accessKeyId = this.configService.get<string>('storage.accessKeyId');
    const secretAccessKey = this.configService.get<string>(
      'storage.secretAccessKey',
    );
    const maxFileSize = this.configService.get<number>('storage.maxFileSize');
    const allowedMimeTypes = this.configService.get<string[]>(
      'storage.allowedMimeTypes',
    );

    if (
      !bucket ||
      !endpoint ||
      !region ||
      !accessKeyId ||
      !secretAccessKey ||
      !maxFileSize ||
      !allowedMimeTypes
    ) {
      console.log(bucket, endpoint, region, accessKeyId, secretAccessKey);
      throw new Error('Missing required storage configuration');
    }

    this.config = {
      bucket,
      endpoint,
      region,
      accessKeyId,
      secretAccessKey,
      maxFileSize,
      allowedMimeTypes,
    };

    this.s3Client = new S3Client({
      endpoint: this.config.endpoint,
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  private validateFile(file: UploadedFile) {
    if (file.size > this.config.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds the limit of ${this.config.maxFileSize} bytes`,
      );
    }

    if (!this.config.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.config.allowedMimeTypes.join(
          ', ',
        )}`,
      );
    }
  }

  async uploadFile(file: UploadedFile): Promise<string> {
    this.validateFile(file);

    const key = `${Date.now()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      }),
    );
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // URL действительна 1 час
  }
}
