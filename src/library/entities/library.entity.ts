import { File } from "src/file/entities/file.entity";
import { Folder } from "src/folder/entities/folder.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {v4 as uuidV4} from 'uuid'

@Entity()
export class Library {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidV4()

    @Column()
    name: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(type => User, user => user.library)
    owner: User

    @OneToMany(type => Folder, folder => folder.associated_library)
    folders: Folder[]

    @OneToMany(type => File, file => file.library)
    files: File[]
}
