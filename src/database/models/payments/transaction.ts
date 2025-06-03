import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'
import {User} from "@/database/models/user/user";
import {TransactionStatus, TransactionType} from "@/database/models/payments/interfaces/transaction";
import {Armoney} from "@/database/models/payments/armoney";
import {Cryptomus} from "@/database/models/payments/cryptomus";

@Entity({ name: 'transactions' })
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

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
        enum: TransactionStatus,
        default: TransactionStatus.CREATE
    })
    status: TransactionStatus

    @Column({ name: 'amount', type: 'decimal', precision: 18, scale: 2 })
    amount: number

    @ManyToOne(() => Armoney, { nullable: true })
    armoney: Armoney;

    @ManyToOne(() => Cryptomus, { nullable: true })
    cryptomus: Cryptomus;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
