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

    @Column({ name: 'moderation', type: 'bool', width: 1, default: false })
    moderation: boolean

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE
    })
    status: UserStatus

    @Column({ name: 'balance', type: "bigint", transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value)
        }, default: 0 })
    balance: number

    @Column({ name: 'reservedBalance',type: 'bigint', transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value)
        }, default: 0 })
    reservedBalance: number;

    @Column({ name: 'username_visibility', type: "boolean", default: 1 })
    usernameVisibility: boolean

    @Column({ name: 'points', type: "int", default: 0 })
    points: number

    @Column({ name: 'win_rate', type: "int", default: 0 })
    winRate: number

    @Column({ name: 'lose_rate', type: "int", default: 0 })
    loseRate: number

    @Column({ name: 'total_deposit', type: "bigint", transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value)
        }, default: 0 })
    totalDeposit: number

    @Column({ name: 'total_withdraw', type: "bigint", transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value)
        }, default: 0 })
    totalWithdraw: number

    @Column({ name: 'total_bet_amount', type: "bigint", transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value)
        }, default: 0 })
    totalBetAmount: number

    @Column({ name: 'total_win_amount', type: "bigint", transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value)
        }, default: 0 })
    totalWinAmount: number

    @Column({ name: 'total_win', type: "bigint", transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value)
        }, default: 0 })
    totalWin: number

    @Column({ name: 'total_lose_amount', type: "bigint", transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value)
        }, default: 0 })
    totalLoseAmount: number

    @Column({ name: 'total_lose', type: "bigint", transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value)
        }, default: 0 })
    totalLose: number

    @Column({ name: 'wager', type: "bigint", transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value)
        }, default: 0 })
    wager: number

    @ManyToOne(() => User, { nullable: true })
    refferal: User;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

}
