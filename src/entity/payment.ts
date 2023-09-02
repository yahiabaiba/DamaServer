import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { account } from "./account";
import { billing } from "./billing";
import { payment_type } from "./payment_type";
import { scope } from "./scope";
import { service } from "./service";

@Entity()
export class payment {
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
    billing_id: number;
    @ManyToOne(type => billing)
    @JoinColumn({ name: "billing_id" })
    billings: billing;

    @Index()
    @Column({ nullable: false })
    type_id: number;
    @ManyToOne(type => payment_type)
    @JoinColumn({ name: "type_id" })
    types: payment_type;

    @Index()
    @Column({ nullable: true })
    scope_id: number;
    @ManyToOne(type => scope)
    @JoinColumn({ name: "scope_id" })
    scopes: scope;

    @Index()
    @Column({ nullable: true })
    service_id: number;
    @ManyToOne(type => service)
    @JoinColumn({ name: "service_id" })
    services: service;

    @Column({type: "numeric", precision: 10, scale: 2, nullable: false})
    amount: number;

    @Column({default: () => "now()", nullable: false})
    created: Date;

    @Column({nullable: true})
    expired: Date;
}