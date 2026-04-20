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
    private static readonly REFRESH_TOKEN_HASH_ROUNDS = 10;
    private static readonly REFRESH_TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

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
        const user = await this._validateCredentialsOrThrow(email, password);
        return this._issueTokens(user.id, user.email);
    }

    async refresh(refreshToken: string) {
        const payload = await this._verifyRefreshTokenOrThrow(refreshToken);
        const isValid = await this._hasMatchingRefreshTokenHash(payload.sub, refreshToken);

        if (!isValid) throw new UnauthorizedException('Refresh token revoked');
        return this._issueTokens(payload.sub, payload.email);
    }

    async logout(refreshToken: string) {
        const payload = await this._tryVerifyRefreshToken(refreshToken);
        if (!payload) {
            return { success: true };
        }

        await this._deleteUserRefreshTokens(payload.sub);
        return { success: true };
    }

    private async _issueTokens(userId: string, email: string) {
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

        await this._deleteUserRefreshTokens(userId);
        const tokenHash = await bcrypt.hash(refreshToken, AuthService.REFRESH_TOKEN_HASH_ROUNDS);
        const expiresAt = this._getRefreshTokenExpiryDate();
        await this.refreshTokenRepository.save({
            userId,
            tokenHash,
            expiresAt,
        });

        return { accessToken, refreshToken };
    }

    private async _validateCredentialsOrThrow(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordOk = await bcrypt.compare(password, user.passwordHash);
        if (!passwordOk) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    private async _verifyRefreshTokenOrThrow(refreshToken: string) {
        const payload = await this._tryVerifyRefreshToken(refreshToken);
        if (!payload) throw new UnauthorizedException('Invalid refresh token');
        return payload;
    }

    private async _tryVerifyRefreshToken(refreshToken: string) {
        try {
            return await this.jwtService.verifyAsync<{ sub: string; email: string }>(refreshToken, {
                secret: this.jwtConfig.refreshSecret,
            });
        } catch {
            return null;
        }
    }

    private async _hasMatchingRefreshTokenHash(
        userId: string,
        incomingRefreshToken: string,
    ): Promise<boolean> {
        const storedTokens = await this.refreshTokenRepository.find({
            where: { userId },
        });
        if (!storedTokens.length) return false;

        for (const tokenEntity of storedTokens) {
            const matches = await bcrypt.compare(incomingRefreshToken, tokenEntity.tokenHash);
            if (matches) return true;
        }

        return false;
    }

    private _deleteUserRefreshTokens(userId: string): Promise<unknown> {
        return this.refreshTokenRepository.delete({ userId });
    }

    private _getRefreshTokenExpiryDate(): Date {
        return new Date(Date.now() + AuthService.REFRESH_TOKEN_LIFETIME_MS);
    }
}
