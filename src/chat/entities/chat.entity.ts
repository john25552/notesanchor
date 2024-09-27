import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuidv4} from 'uuid'


@Entity()
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4()

    @Column()
    name: string

    @ManyToOne(type => User, user => user.chats)
    owner: User

    @Column("json")
    participants: string[]
}
