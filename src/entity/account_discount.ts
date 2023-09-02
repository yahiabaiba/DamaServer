import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { account } from "./account";
import { discount } from "./discount";

@Entity()
export class account_discount {
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
    discount_id: number;
    @ManyToOne(type => discount)
    @JoinColumn({ name: "discount_id" })
    discounts: discount;

    @Column({default: () => "now()", nullable: false})
    created: Date;

    @Column({nullable: true})
    deleted: Date;
}