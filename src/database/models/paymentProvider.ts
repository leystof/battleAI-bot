import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'

export enum ProviderName {
    ARMONEY = "armoney",
    SEQUOIA = "sequoia",
}

@Entity({ name: 'payment_providers' })
export class PaymentProvider {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: ProviderName,
        default: null
    })
    name: ProviderName

    @Column({ name: 'min_topup', type: "int", nullable: false })
    minTopUp: number

    @Column({ name: 'min_payout', type: "int", nullable: false })
    minPayOut: number
}
