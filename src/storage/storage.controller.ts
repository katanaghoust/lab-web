import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UploadedFile as UploadedFileType } from './storage.service';

@Controller('api/storage')
@ApiTags('Storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'File key in storage',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: UploadedFileType) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const key = await this.storageService.uploadFile(file);
    return { key };
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get file URL' })
  @ApiResponse({
    status: 200,
    description: 'File URL generated successfully',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Signed URL for file access',
        },
      },
    },
  })
  async getFileUrl(@Param('key') key: string) {
    const url = await this.storageService.getSignedUrl(key);
    return { url };
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
  })
  async deleteFile(@Param('key') key: string) {
    await this.storageService.deleteFile(key);
    return { message: 'File deleted successfully' };
  }
}
