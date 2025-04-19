import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({ unique: true })
        email: string;

    @Column()
        username: string;

    @Column()
        password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
        role: UserRole;

    @CreateDateColumn()
        createdAt: Date;

    @UpdateDateColumn()
        updatedAt: Date;
}
