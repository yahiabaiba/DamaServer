import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { games } from "./games";

@Entity()
export class game_styles {
    @PrimaryColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    game_id: number;
    @ManyToOne(type => games)
    @JoinColumn({ name: "game_id" })
    game: games;

    @Column({ nullable: false, type: "varchar", length: 100 })
    name: string;

    @Column({ nullable: true })
    player_num: number;

    @Column({ nullable: true, type: "varchar", length: 100 })
    suffix: string;
}