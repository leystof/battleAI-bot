import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'

@Entity({ name: 'payment_providers' })
export class PaymentProvider {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'name', type: "varchar", nullable: false })
    name: number

    @Column({ name: 'min_topup', type: "int", nullable: false })
    minTopUp: number

    @Column({ name: 'min_payout', type: "int", nullable: false })
    minPayOut: number
}
