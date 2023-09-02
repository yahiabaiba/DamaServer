import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { payment } from "./payment";

@Entity()
export class coupon {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: true })
    payment_id: number;
    @ManyToOne(type => payment)
    @JoinColumn({ name: "payment_id" })
    payments: payment;

    @Index({unique: true})
    @Column({ type: "varchar", length: 100, nullable: false })
    code: string;

    @Column({type: "numeric", precision: 10, scale: 2, nullable: false})
    amount: number;

    @Column({default: () => "now()", nullable: false})
    created: Date;

    @Column({nullable: true})
    activated: Date;
}