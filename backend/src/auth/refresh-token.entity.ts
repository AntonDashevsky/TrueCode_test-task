import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    tokenHash: string;

    @Column({ type: 'timestamp' })
    expiresAt: Date;
}
