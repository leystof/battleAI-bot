import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'
import {PaymentProvider} from "@/database/models/paymentProvider";

@Entity()
export class Config {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'supportUrl', type: 'varchar', default: '' })
    supportUrl: string

    @Column({ name: 'channelLiveUrl', type: 'varchar', default: ''})
    channelLiveUrl: string

    @Column({ name: 'channelCallbackId', type: 'bigint', default: 0})
    channelCallbackId: number

    @Column({ name: 'channelInvoiceId', type: 'bigint', default: 0})
    channelInvoiceId: number

    @Column({ name: 'channelPayOutId', type: 'bigint', default: 0})
    channelPayOutId: number

    @Column({ name: 'channelModerationPayOutId', type: 'bigint', default: 0})
    channelModerationPayOutId: number

    @ManyToOne(() => PaymentProvider, { nullable: true })
    rubProvider: PaymentProvider;
}
