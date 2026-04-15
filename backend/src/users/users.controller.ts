import {
    BadRequestException,
    Controller,
    Get,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    getMyProfile(@CurrentUser('sub') userId: string) {
        return this.usersService.getProfile(userId);
    }

    @Patch('me')
    updateProfile(@CurrentUser('sub') userId: string, @Body() dto: UpdateProfileDto) {
        return this.usersService.updateProfile(userId, dto);
    }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    updateAvatar(@CurrentUser('sub') userId: string, @UploadedFile() file?: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Avatar file is required');
        }
        return this.usersService.updateAvatar(userId, file.filename);
    }
}
