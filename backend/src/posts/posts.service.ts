import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostImage } from './post-image.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsQueryDto } from './dto/posts-query.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
        @InjectRepository(PostImage)
        private readonly postImagesRepository: Repository<PostImage>,
    ) {}

    private _toPostView(post: Post) {
        return {
            id: post.id,
            text: post.text,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            images: post.images,
            author: {
                id: post.author?.id ?? post.authorId,
                firstName: post.author?.firstName ?? '',
                lastName: post.author?.lastName ?? '',
                avatarPath: post.author?.avatarPath ?? null,
            },
        };
    }

    async list(userId: string, query: PostsQueryDto) {
        const { page, limit, sort } = query;
        const [items, total] = await this.postsRepository.findAndCount({
            where: { authorId: userId },
            order: { createdAt: sort === 'newest' ? 'DESC' : 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: {
                author: true,
            },
        });

        return {
            items: items.map((post) => this._toPostView(post)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }

    async create(userId: string, dto: CreatePostDto, files: Express.Multer.File[] = []) {
        const post = await this.postsRepository.save(
            this.postsRepository.create({
                authorId: userId,
                text: dto.text,
            }),
        );

        if (files.length) {
            const images = files.map((file, index) =>
                this.postImagesRepository.create({
                    postId: post.id,
                    path: file.filename,
                    sortOrder: index,
                }),
            );
            await this.postImagesRepository.save(images);
        }

        const createdPost = await this.findOneOwned(post.id, userId);
        return this._toPostView(createdPost);
    }

    async update(
        postId: string,
        userId: string,
        dto: UpdatePostDto,
        files: Express.Multer.File[] = [],
    ) {
        const post = await this.findOneOwned(postId, userId);
        if (dto.text !== undefined) {
            post.text = dto.text;
            await this.postsRepository.save(post);
        }

        if (dto.removeImageIds?.length) {
            await this.postImagesRepository.delete({
                id: In(dto.removeImageIds),
                postId,
            });
        }

        if (files.length) {
            const currentCount = post.images?.length ?? 0;
            const images = files.map((file, index) =>
                this.postImagesRepository.create({
                    postId,
                    path: file.filename,
                    sortOrder: currentCount + index,
                }),
            );
            await this.postImagesRepository.save(images);
        }

        const updatedPost = await this.findOneOwned(postId, userId);
        return this._toPostView(updatedPost);
    }

    async remove(postId: string, userId: string) {
        const post = await this.findOneOwned(postId, userId);
        await this.postsRepository.remove(post);
        return { success: true };
    }

    private async findOneOwned(postId: string, userId: string) {
        const post = await this.postsRepository.findOne({
            where: { id: postId },
            relations: {
                author: true,
            },
        });
        if (!post) throw new NotFoundException('Post not found');
        if (post.authorId !== userId) throw new ForbiddenException('No access');
        return post;
    }
}
