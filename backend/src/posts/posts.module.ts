import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostImage } from './post-image.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { FilesModule } from '../files/files.module';

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostImage]), FilesModule],
    providers: [PostsService],
    controllers: [PostsController],
})
export class PostsModule {}
