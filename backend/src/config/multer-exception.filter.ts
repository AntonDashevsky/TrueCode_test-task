import { Catch, ExceptionFilter, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { MulterError } from 'multer';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
    catch(error: MulterError, host: ArgumentsHost) {
        void host;
        let message = error.message;

        if (error.code === 'LIMIT_FILE_SIZE') {
            message = 'File size too large. Maximum size is 5MB';
        } else if (error.code === 'LIMIT_FILE_COUNT') {
            message = 'Too many files. Maximum is 10 files';
        } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            message = 'Too many files uploaded. Maximum is 10 files';
        }

        throw new BadRequestException(message);
    }
}
