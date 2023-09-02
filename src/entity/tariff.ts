import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class tariff {
    @PrimaryColumn()
    id: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 1000, nullable: true })
    description: string;

    @Column({ default: 0, nullable: false  })
    is_default: number;
    
    @Column({default: () => "now()", nullable: false})
    created: Date;

    @Column({nullable: true})
    deleted: Date;
}