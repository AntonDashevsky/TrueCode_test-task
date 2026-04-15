import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { PostImage } from './post-image.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    author: User;

    @Column()
    authorId: string;

    @Column({ type: 'text' })
    text: string;

    @OneToMany(() => PostImage, (image) => image.post, {
        cascade: true,
        eager: true,
    })
    images: PostImage[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
