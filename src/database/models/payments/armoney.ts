import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'
import {User} from "@/database/models/user/user";
import {
    ARMoneyTransactionAppealReason, ARMoneyTransactionAppealState,
    ARMoneyTransactionCurrency,
    ARMoneyTransactionStatus,
} from "@/database/models/payments/interfaces/armoney";
import {TransactionType} from "@/database/models/payments/interfaces/transaction";

@Entity({ name: 'armoney_payments' })
export class Armoney {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'externalId', type: "varchar", nullable: false })
    externalId: string

    @ManyToOne(() => User, { nullable: false })
    user: User;

    @Column({ name: 'userId', type: "int", nullable: false })
    userId: number;

    @Column({
        type: 'enum',
        enum: TransactionType,
        nullable: false
    })
    type: TransactionType

    @Column({
        type: 'enum',
        enum: ARMoneyTransactionStatus,
        default: ARMoneyTransactionStatus.CREATE
    })
    status: ARMoneyTransactionStatus

    @Column({ name: 'amount', type: 'decimal', precision: 18, scale: 2, nullable: false })
    amount: number

    @Column({ name: 'percent', type: 'decimal', precision: 18, scale: 2 })
    percentProvider: number;

    @Column({
        type: 'enum',
        enum: ARMoneyTransactionCurrency,
        nullable: false
    })
    currency: ARMoneyTransactionCurrency

    @Column({
        type: 'enum',
        enum: ARMoneyTransactionAppealState,
        default: null
    })
    appealState: ARMoneyTransactionAppealState

    @Column({
        type: 'enum',
        enum: ARMoneyTransactionAppealReason,
        default: null
    })
    appealReason: ARMoneyTransactionAppealReason

    @Column({ name: 'operationId', type: "varchar", nullable: true })
    operationId: string

    @Column({ default: false })
    processed: boolean;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
