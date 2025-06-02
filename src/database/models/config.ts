import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'
import {PaymentProvider} from "@/database/models/paymentProvider";

@Entity()
export class Config {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'currencyName', type: 'varchar', default: ''})
    currencyName: string

    @Column({ name: 'supportUrl', type: 'varchar', default: '' })
    supportUrl: string

    @Column({ name: 'channelLiveUrl', type: 'varchar', default: ''})
    channelLiveUrl: string

    @Column({ name: 'channelLiveId', type: 'bigint', default: 0})
    channelLiveId: number

    @Column({ name: 'channelCallbackId', type: 'bigint', default: 0})
    channelCallbackId: number

    @Column({ name: 'channelInvoiceId', type: 'bigint', default: 0})
    channelInvoiceId: number

    @Column({ name: 'channelPayOutId', type: 'bigint', default: 0})
    channelPayOutId: number

    @Column({ name: 'channelModerationPayOutId', type: 'bigint', default: 0})
    channelModerationPayOutId: number

    @Column({ name: 'matchFeePercent', type: 'decimal', precision: 5, scale: 2, default: 10 })
    matchFeePercent: number

    @Column({ default: false })
    stop: boolean;

    @ManyToOne(() => PaymentProvider, { nullable: true })
    paymentRubProvider: PaymentProvider;

    @ManyToOne(() => PaymentProvider, { nullable: true })
    paymentUsdtProvider: PaymentProvider;

    @ManyToOne(() => PaymentProvider, { nullable: true })
    withdrawRubProvider: PaymentProvider;
}
