import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { MulterExceptionFilter } from './config/multer-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const allowedOrigins = process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL]
        : ['http://localhost:5173'];
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    app.useGlobalFilters(new MulterExceptionFilter());

    const uploadsDir = join(process.cwd(), '../uploads');
    if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
    }
    app.useStaticAssets(uploadsDir, {
        prefix: '/uploads/',
    });

    await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
