import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {PaymentProvider} from "@/database/models/paymentProvider";

export enum ProviderTierType {
    TOPUP = "topup",
    WITHDRAW = "withdraw",
}

@Entity({ name: 'tiers_provider' })
export class TierProvider {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PaymentProvider)
    provider: PaymentProvider;

    @Column({
        type: 'enum',
        enum: ProviderTierType,
        default: null
    })
    type: ProviderTierType

    @Column({ name: 'min_amount', type: 'int' })
    minAmount: number;

    @Column({ name: 'percent', type: 'decimal', precision: 5, scale: 2 })
    percent: number;
}