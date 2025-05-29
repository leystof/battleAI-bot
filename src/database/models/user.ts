import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'

export enum UserStatus {
    ACTIVE = "active",
    BAN = "ban",
}
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'tgId', type: 'bigint', unique: true })
    tgId: number

    @Column({ name: 'admin', type: 'bool', width: 1, default: false })
    admin: boolean

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE
    })
    status: UserStatus

    @Column({ name: 'balance', type: "bigint", default: 0 })
    balance: number

    @Column({ name: 'reservedBalance',type: 'bigint', default: 0 })
    reservedBalance: string;

    @Column({ name: 'username_visibility', type: "boolean", default: 1 })
    usernameVisibility: boolean

    @Column({ name: 'points', type: "int", default: 0 })
    points: number

    @Column({ name: 'win_rate', type: "int", default: 0 })
    winRate: number

    @Column({ name: 'lose_rate', type: "int", default: 0 })
    loseRate: number

    @ManyToOne(() => User, { nullable: true })
    refferal: User;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

}
