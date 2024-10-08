import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Space {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column()
    name: string

    @Column('mediumtext')
    description: string 

    @ManyToOne(type => User, user => user.spaces)
    owner: User

    @Column('json')
    participants: string[]
}
