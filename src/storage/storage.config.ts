import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  endpoint: process.env.STORAGE_ENDPOINT || 'https://storage.yandexcloud.net',
  region: process.env.STORAGE_REGION || 'ru-central1',
  bucket: process.env.STORAGE_BUCKET || 'lab-web-car-service-falcon',
  accessKeyId: process.env.STORAGE_SECRET_KEY_ID,
  secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB in bytes
  allowedMimeTypes: (
    process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/gif'
  ).split(','),
}));
