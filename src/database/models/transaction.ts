import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'
import {User} from "@/database/models/user";
import {
    TransactionAppealReason, TransactionAppealState,
    TransactionCurrency,
    TransactionSource,
    TransactionStatus,
    TransactionType
} from "@/database/models/interfaces/transaction";

@Entity({ name: 'transactions' })
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'externalId', type: "varchar", nullable: false })
    externalId: string

    @ManyToOne(() => User, { nullable: false })
    user: User;

    @Column({
        type: 'enum',
        enum: TransactionType,
        nullable: false
    })
    type: TransactionType

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.CREATE
    })
    status: TransactionStatus

    @Column({ name: 'amount', type: "int", nullable: false })
    amount: number

    @Column({ name: 'percent', type: 'decimal', precision: 5, scale: 2 })
    percentProvider: number;

    @Column({
        type: 'enum',
        enum: TransactionCurrency,
        nullable: false
    })
    currency: TransactionCurrency

    @Column({
        type: 'enum',
        enum: TransactionSource,
        nullable: false
    })
    source: TransactionSource

    @Column({
        type: 'enum',
        enum: TransactionAppealState,
        default: null
    })
    appealState: TransactionAppealState

    @Column({
        type: 'enum',
        enum: TransactionAppealReason,
        default: null
    })
    appealReason: TransactionAppealReason

    @Column({ default: false })
    processed: boolean;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
