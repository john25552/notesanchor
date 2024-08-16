import { File } from "src/file/entities/file.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidV4()

    @Column()
    body: string

    @ManyToOne(type => File, file => file.comments)
    file: File

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
