import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { service } from "./service";
import { tariff } from "./tariff";

@Entity()
export class tariff_service {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    tariff_id: number;
    @ManyToOne(type => tariff)
    @JoinColumn({ name: "tariff_id" })
    tariffs: tariff;

    @Index()
    @Column({ nullable: false })
    service_id: number;
    @ManyToOne(type => service)
    @JoinColumn({ name: "service_id" })
    services: service;

    @Column({ default: 0, nullable: false  })
    is_default: number;

    @Column({ type: "numeric", default: 0, nullable: false  })
    price: number;

    @Column({default: () => "now()", nullable: false})
    created: Date;

    @Column({nullable: true})
    deleted: Date;
}