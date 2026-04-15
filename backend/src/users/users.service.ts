import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async onModuleInit() {
        const existing = await this.usersRepository.findOne({
            where: { email: 'user@example.com' },
        });
        if (existing) return;

        const passwordHash = await bcrypt.hash('password123', 10);
        await this.usersRepository.save(
            this.usersRepository.create({
                email: 'user@example.com',
                passwordHash,
                firstName: 'Demo',
                lastName: 'User',
                about: 'Test account',
                phone: '+70000000000',
            }),
        );
    }

    findById(id: string) {
        return this.usersRepository.findOne({ where: { id } });
    }

    findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async getProfile(userId: string) {
        const user = await this.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        return this.toProfile(user);
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const user = await this.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        Object.assign(user, dto);
        const updated = await this.usersRepository.save(user);
        return this.toProfile(updated);
    }

    async updateAvatar(userId: string, avatarPath: string) {
        const user = await this.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        user.avatarPath = avatarPath;
        const updated = await this.usersRepository.save(user);
        return this.toProfile(updated);
    }

    toProfile(user: User) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            about: user.about,
            phone: user.phone,
            avatarPath: user.avatarPath,
        };
    }
}
