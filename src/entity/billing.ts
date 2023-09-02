import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class billing {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: () => "now()", nullable: false})
    created: Date;

    @Column({nullable: true})
    closed: Date;
}