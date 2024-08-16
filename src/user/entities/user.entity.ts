import { File } from "src/file/entities/file.entity";
import { Library } from "src/library/entities/library.entity";
import { Message } from "src/message/entities/message.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column({nullable: true})
    full_name?: string

    @Column()
    email_address: string

    @Column()
    password: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(type => Library, library => library.owner)
    library: Library[]

    @OneToMany(type => File, file => file.owner)
    files: File[]

    @OneToMany(type => Message, message => message.owner)
    messages: Message[]
}
