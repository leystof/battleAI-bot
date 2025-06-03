import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'
import {User} from "@/database/models/user/user";
import {
    ARMoneyTransactionAppealReason, ARMoneyTransactionAppealState,
    ARMoneyTransactionCurrency,
    ARMoneyTransactionStatus,
} from "@/database/models/payments/interfaces/armoney";
import {TransactionType} from "@/database/models/payments/interfaces/transaction";
import {CryptomusStatus} from "@/database/models/payments/interfaces/cryptomus";

@Entity({ name: 'cryptomus_payments' })
export class Cryptomus {
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
        enum: CryptomusStatus,
        default: CryptomusStatus.CONFIRM_CHECK
    })
    status: CryptomusStatus

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

    @Column({ default: false })
    processed: boolean;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
