import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class discount_type {
    @PrimaryColumn()
    id: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 1000, nullable: true })
    description: string;
}