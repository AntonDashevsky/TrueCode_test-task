import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { PostsQueryDto } from './dto/posts-query.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    list(@CurrentUser('sub') userId: string, @Query() query: PostsQueryDto) {
        return this.postsService.list(userId, query);
    }

    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    create(
        @CurrentUser('sub') userId: string,
        @Body() dto: CreatePostDto,
        @UploadedFiles() files?: Express.Multer.File[],
    ) {
        return this.postsService.create(userId, dto, files);
    }

    @Patch(':id')
    @UseInterceptors(FilesInterceptor('images'))
    update(
        @Param('id') id: string,
        @CurrentUser('sub') userId: string,
        @Body() dto: UpdatePostDto,
        @UploadedFiles() files?: Express.Multer.File[],
    ) {
        return this.postsService.update(id, userId, dto, files);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
        return this.postsService.remove(id, userId);
    }
}
