import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity('post_images')
export class PostImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Post, (post) => post.images, { onDelete: 'CASCADE' })
    post: Post;

    @Column()
    postId: string;

    @Column()
    path: string;

    @Column({ default: 0 })
    sortOrder: number;
}
