import { Column, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

export class Space {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();
    @Column()
    name: string
    @Column()
    owner: string
    @Column()
    participants: string[]
}
