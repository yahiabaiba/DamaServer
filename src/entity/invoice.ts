import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { account } from "./account";
import { billing } from "./billing";
import { discount } from "./discount";
import { service } from "./service";

@Entity()
export class invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    account_id: number;
    @ManyToOne(type => account)
    @JoinColumn({ name: "account_id" })
    accounts: account;

    @Index()
    @Column({ nullable: false })
    service_id: number;
    @ManyToOne(type => service)
    @JoinColumn({ name: "service_id" })
    services: service;

    @Index()
    @Column({ nullable: false })
    billing_id: number;
    @ManyToOne(type => billing)
    @JoinColumn({ name: "billing_id" })
    billings: billing;

    @Index()
    @Column({ nullable: true })
    discount_id: number;
    @ManyToOne(type => discount)
    @JoinColumn({ name: "discount_id" })
    discounts: discount;

    @Column({type: "bigint", nullable: false})
    quantity: number;

    @Column({type: "numeric", precision: 10, scale: 2, nullable: false})
    amount: number;

    @Column({default: () => "now()", nullable: false})
    created: Date;

    @Column({nullable: true})
    closed: Date;

    @Column({nullable: true})
    changed: Date;
}