import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { tariff } from "./tariff";

@Entity()
export class account_limit {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    tariff_id: number;
    @ManyToOne(type => tariff)
    @JoinColumn({ name: "tariff_id" })
    tariff: tariff;

    @Column({ nullable: false  })
    max_quantity: number;
}