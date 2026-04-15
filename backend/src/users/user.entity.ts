import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ default: '' })
    firstName: string;

    @Column({ default: '' })
    lastName: string;

    @Column({ type: 'date', nullable: true })
    birthDate: string | null;

    @Column({ type: 'text', default: '' })
    about: string;

    @Column({ default: '' })
    phone: string;

    @Column({ type: 'text', nullable: true })
    avatarPath: string | null;

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[];
}
