import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'
import {User} from "@/database/models/user/user";

export enum MatchType {
    PROMPT = "prompt",
}

export enum MatchStatus {
    QUEUE = "queue",
    WAIT_PROMPTS = "wait_prompts",
    ANALYZE = "analyze",
    ERROR = "error",
    SUCCESSFUL = "successful",
}
@Entity({ name: 'matches' })
export class Match {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'original_prompt', type: "text", default: '' })
    originalPrompt: string;

    @ManyToOne(() => User, { nullable: false })
    player1: User;

    @Column({ name: 'player1_prompt', type: "text", default: '' })
    player1Prompt: string;

    @ManyToOne(() => User, { nullable: false })
    player2: User;

    @Column({ name: 'player2_prompt', type: "text", default: '' })
    player2Prompt: string;

    @ManyToOne(() => User, { nullable: true })
    win: User;

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

    @Column({ name: 'img_url', type: "varchar", default: "" })
    img_url: string

    @Column({ name: 'feePercent', type: 'decimal', precision: 5, scale: 2, default: 10 })
    feePercent: number

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
