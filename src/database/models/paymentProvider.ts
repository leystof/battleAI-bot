import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'
import {ProviderTierType} from "@/database/models/TierProvider";

export enum ProviderName {
    ARMONEY = "armoney",
    CRYPTOMUS = "cryptomus",
}

@Entity({ name: 'payment_providers' })
export class PaymentProvider {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: ProviderName,
        nullable: false
    })
    name: ProviderName

    @Column({ name: 'min_topup', type: "int", nullable: false })
    minTopUp: number

    @Column({ name: 'min_payout', type: "int", nullable: false })
    minPayOut: number
}
