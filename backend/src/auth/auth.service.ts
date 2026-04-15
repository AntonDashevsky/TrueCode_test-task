import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { getJwtConfig } from '../config/jwt.config';

@Injectable()
export class AuthService {
    private readonly jwtConfig: ReturnType<typeof getJwtConfig>;

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
    ) {
        this.jwtConfig = getJwtConfig(configService);
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const passwordOk = await bcrypt.compare(password, user.passwordHash);
        if (!passwordOk) throw new UnauthorizedException('Invalid credentials');
        return this.issueTokens(user.id, user.email);
    }

    async refresh(refreshToken: string) {
        let payload: { sub: string; email: string };
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.jwtConfig.refreshSecret,
            });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const storedTokens = await this.refreshTokenRepository.find({
            where: { userId: payload.sub },
        });
        const valid = await Promise.any(
            storedTokens.map(async (tokenEntity) => ({
                ok: await bcrypt.compare(refreshToken, tokenEntity.tokenHash),
            })),
        ).catch(() => ({ ok: false }));

        if (!valid.ok) throw new UnauthorizedException('Refresh token revoked');
        return this.issueTokens(payload.sub, payload.email);
    }

    async logout(refreshToken: string) {
        let payload: { sub: string };
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.jwtConfig.refreshSecret,
            });
        } catch {
            return { success: true };
        }
        await this.refreshTokenRepository.delete({ userId: payload.sub });
        return { success: true };
    }

    private async issueTokens(userId: string, email: string) {
        const accessToken = await this.jwtService.signAsync(
            { sub: userId, email },
            {
                secret: this.jwtConfig.accessSecret,
                expiresIn: this.jwtConfig.accessExpiresIn,
            },
        );

        const refreshToken = await this.jwtService.signAsync(
            { sub: userId, email },
            {
                secret: this.jwtConfig.refreshSecret,
                expiresIn: this.jwtConfig.refreshExpiresIn,
            },
        );

        await this.refreshTokenRepository.delete({ userId });
        const tokenHash = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.refreshTokenRepository.save({
            userId,
            tokenHash,
            expiresAt,
        });

        return { accessToken, refreshToken };
    }
}
