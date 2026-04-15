import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10;

@Module({
    imports: [
        MulterModule.register({
            limits: {
                fileSize: MAX_FILE_SIZE,
                files: MAX_FILES,
            },
            storage: diskStorage({
                destination: '../uploads',
                filename: (_req, file, callback) => {
                    callback(null, `${randomUUID()}${extname(file.originalname)}`);
                },
            }),
            fileFilter(_req, file, callback) {
                if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
                    return callback(
                        new Error(
                            `Unsupported file type: ${file.mimetype}. Allowed: ${[...ALLOWED_MIME_TYPES].join(', ')}`,
                        ),
                        false,
                    );
                }

                callback(null, true);
            },
        }),
    ],
    exports: [MulterModule],
})
export class FilesModule {}
