import { ConfigService } from '@nestjs/config';

type JwtExpires = `${number}${'s' | 'm' | 'h' | 'd'}`;

export type JwtConfig = {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: JwtExpires;
    refreshExpiresIn: JwtExpires;
};

export function getJwtConfig(configService: ConfigService): JwtConfig {
    const accessSecret = configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = configService.get<string>('JWT_REFRESH_SECRET');

    if (!accessSecret) {
        throw new Error('JWT_ACCESS_SECRET environment variable is required');
    }
    if (!refreshSecret) {
        throw new Error('JWT_REFRESH_SECRET environment variable is required');
    }

    return {
        accessSecret,
        refreshSecret,
        accessExpiresIn: (configService.get<string>('JWT_ACCESS_EXPIRES_IN') ??
            '15m') as JwtExpires,
        refreshExpiresIn: (configService.get<string>('JWT_REFRESH_EXPIRES_IN') ??
            '7d') as JwtExpires,
    };
}
