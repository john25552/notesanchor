import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {v4 as uuidv4} from 'uuid'

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column()
    body: string

    @Column()
    sender_id: string

    @Column()
    reciever_id: string

    @Column()
    type: "Group" | "Private"

    @CreateDateColumn()
    sentAt: Date

    @ManyToOne(type => User, user => user.messages)
    owner: User
}
