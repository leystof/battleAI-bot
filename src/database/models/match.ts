import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'

export enum MatchType {
    PROMPT = "prompt",
}

export enum MatchStatus {
    QUEUE = "queue",
    ERROR = "error",
    FINISH = "finish",
}
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, { nullable: false })
    player1: User;

    @ManyToOne(() => User, { nullable: false })
    player2: User;

    @Column({
        type: 'enum',
        enum: MatchStatus,
        default: MatchStatus.QUEUE
    })
    status: MatchStatus

    @Column({
        type: 'enum',
        enum: MatchType,
        default: MatchType.PROMPT
    })
    type: MatchType

    @Column({ name: 'bet', type: "int", nullable: false })
    bet: number

    @Column({ name: 'generate_img', type: "boolean", default: false })
    isGenerateImg: boolean

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
