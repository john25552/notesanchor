import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {v4 as uuidv4} from 'uuid'

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column('mediumtext')
    body: string

    @Column()
    sender: string

    @Column()
    receiver: string

    @Column()
    target: string

    @Column()
    type: "Group" | "Private" | "Space"

    @CreateDateColumn()
    sentAt: Date

    @ManyToOne(type => User, user => user.messages)
    owner: User
}
