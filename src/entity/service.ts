import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { scope } from "./scope";
import { service_type } from "./service_type";

@Entity()
export class service {
    @PrimaryColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    type_id: number;
    @ManyToOne(type => service_type)
    @JoinColumn({ name: "type_id" })
    types: service_type;

    @Index()
    @Column({ nullable: true })
    scope_id: number;
    @ManyToOne(type => scope)
    @JoinColumn({ name: "scope_id" })
    scopes: scope;

    @Column({ type: "numeric", nullable: true })
    scale: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 1000, nullable: true })
    description: string;

    @Column({default: () => "now()", nullable: false})
    created: Date;

    @Column({nullable: true})
    deleted: Date;
}