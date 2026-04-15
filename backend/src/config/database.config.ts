import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { PostImage } from '../posts/post-image.entity';
import { RefreshToken } from '../auth/refresh-token.entity';

export function getDatabaseConfig(configService: ConfigService): TypeOrmModuleOptions {
    const host = configService.get<string>('DB_HOST');
    const port = configService.get<number>('DB_PORT');
    const username = configService.get<string>('DB_USER');
    const password = configService.get<string>('DB_PASSWORD');
    const database = configService.get<string>('DB_NAME');

    if (!host || !port || !username || !password || !database) {
        throw new Error(
            'Database configuration is incomplete. Required: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME',
        );
    }

    return {
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        entities: [User, Post, PostImage, RefreshToken],
        synchronize: true,
    };
}
