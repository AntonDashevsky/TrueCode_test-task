import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostImage } from './post-image.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsQueryDto } from './dto/posts-query.dto';

type PostsTxRepositories = {
    postsRepository: Repository<Post>;
    postImagesRepository: Repository<PostImage>;
};

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
        @InjectRepository(PostImage)
        private readonly postImagesRepository: Repository<PostImage>,
        private readonly dataSource: DataSource,
    ) {}

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
        const post = await this._withPostRepositories(async ({
            postsRepository,
            postImagesRepository,
        }) => {
            const createdPost = await this._createPostEntity(postsRepository, userId, dto.text);
            await this._savePostImages(postImagesRepository, createdPost.id, files, 0);

            return createdPost;
        });

        const createdPost = await this._findOneOwned(post.id, userId);
        return this._toPostView(createdPost);
    }

    async update(
        postId: string,
        userId: string,
        dto: UpdatePostDto,
        files: Express.Multer.File[] = [],
    ) {
        await this._withPostRepositories(async ({ postsRepository, postImagesRepository }) => {
            const post = await this._findOneOwned(postId, userId, postsRepository);

            await this._updatePostText(postsRepository, post, dto.text);
            await this._removePostImages(postImagesRepository, postId, dto.removeImageIds);

            const currentCount = await this._countPostImages(postImagesRepository, postId);
            await this._savePostImages(postImagesRepository, postId, files, currentCount);
        });

        const updatedPost = await this._findOneOwned(postId, userId);
        return this._toPostView(updatedPost);
    }

    async remove(postId: string, userId: string) {
        const post = await this._findOneOwned(postId, userId);
        await this.postsRepository.remove(post);
        return { success: true };
    }

    // ПРИВАТНЫЕ МЕТОДЫ

    private async _findOneOwned(
        postId: string,
        userId: string,
        postsRepository: Repository<Post> = this.postsRepository,
    ) {
        const post = await postsRepository.findOne({
            where: { id: postId },
            relations: {
                author: true,
            },
        });
        if (!post) throw new NotFoundException('Post not found');
        if (post.authorId !== userId) throw new ForbiddenException('No access');
        return post;
    }

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

    private _createPostEntity(
        postsRepository: Repository<Post>,
        authorId: string,
        text: string,
    ): Promise<Post> {
        return postsRepository.save(
            postsRepository.create({
                authorId,
                text,
            }),
        );
    }

    private async _updatePostText(
        postsRepository: Repository<Post>,
        post: Post,
        text: string | undefined,
    ): Promise<void> {
        if (text === undefined) return;
        post.text = text;
        await postsRepository.save(post);
    }

    private async _removePostImages(
        postImagesRepository: Repository<PostImage>,
        postId: string,
        removeImageIds: string[] | undefined,
    ): Promise<void> {
        if (!removeImageIds?.length) return;
        await postImagesRepository.delete({
            id: In(removeImageIds),
            postId,
        });
    }

    private _countPostImages(
        postImagesRepository: Repository<PostImage>,
        postId: string,
    ): Promise<number> {
        return postImagesRepository.count({
            where: { postId },
        });
    }

    private async _savePostImages(
        postImagesRepository: Repository<PostImage>,
        postId: string,
        files: Express.Multer.File[],
        startSortOrder = 0,
    ): Promise<void> {
        if (!files.length) return;

        const images = files.map((file, index) =>
            postImagesRepository.create({
                postId,
                path: file.filename,
                sortOrder: startSortOrder + index,
            }),
        );
        await postImagesRepository.save(images);
    }

    private _withPostRepositories<T>(
        operation: (repositories: PostsTxRepositories) => Promise<T>,
    ): Promise<T> {
        return this.dataSource.transaction(async (manager) =>
            operation({
                postsRepository: manager.getRepository(Post),
                postImagesRepository: manager.getRepository(PostImage),
            }),
        );
    }
}
