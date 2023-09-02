import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { account } from "./account";
import { users } from "./users";

@Entity()
export class user_account {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    account_id: number;
    @ManyToOne(type => account)
    @JoinColumn({ name: "account_id" })
    accounts: account;

    @Index()
    @Column({ nullable: false })
    user_id: number;
    @ManyToOne(type => users)
    @JoinColumn({ name: "user_id" })
    user: users;

    @Column({default: () => "now()", nullable: false})
    created: Date;

    @Column({nullable: true})
    deleted: Date;
}