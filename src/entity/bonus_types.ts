import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class bonus_types {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    name: string;

    @Column({ nullable: true })
    expire_period: number;
}