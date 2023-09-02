import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { tariff } from "./tariff";

@Entity()
export class account {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    tariff_id: number;
    @ManyToOne(type => tariff)
    @JoinColumn({ name: "tariff_id" })
    tariffs: tariff;

    @Column({type: "numeric", precision: 10, scale: 2, nullable: false})
    balance: number;

    @Column({default: () => "now()", nullable: false})
    created: Date;

    @Column({nullable: true})
    deleted: Date;

    @Column({nullable: true})
    changed: Date;
}