import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { discount_type } from "./discount_type";
import { scope } from "./scope";
import { service } from "./service";
import { tariff } from "./tariff";

@Entity()
export class discount {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    type_id: number;
    @ManyToOne(type => discount_type)
    @JoinColumn({ name: "type_id" })
    types: discount_type;

    @Index()
    @Column({ nullable: false })
    tariff_id: number;
    @ManyToOne(type => tariff)
    @JoinColumn({ name: "tariff_id" })
    tariffs: tariff;

    @Index()
    @Column({ nullable: true })
    service_id: number;
    @ManyToOne(type => service)
    @JoinColumn({ name: "service_id" })
    services: service;

    @Index()
    @Column({ nullable: true })
    scope_id: number;
    @ManyToOne(type => scope)
    @JoinColumn({ name: "scope_id" })
    scopes: scope;

    @Column({type: "numeric", precision: 10, scale: 2, nullable: false})
    percent: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 1000, nullable: true })
    description: string;
}