import { Entity, PrimaryGeneratedColumn, Index, Column, ManyToOne, JoinColumn } from "typeorm";
import { games } from "./games";
import { bonus_types } from "./bonus_types";

@Entity()
export class bonus_games {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    game_id: number;
    @ManyToOne(type => games)
    @JoinColumn({ name: "game_id" })
    game: games;

    @Index()
    @Column({ nullable: false })
    bonustype_id: number;
    @ManyToOne(type => bonus_types)
    @JoinColumn({ name: "bonustype_id" })
    bonustype: bonus_types;

    @Column({default: () => "now()", nullable: false})
    created: Date;

    @Column({nullable: true})
    expired: Date;
}