import { Comment } from "src/comment/entities/comment.entity";
import { Library } from "src/library/entities/library.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity()
export class File {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidV4()

    @Column()
    name: string

    @Column()
    type: string

    @Column('mediumtext')
    body: string

    @Column()
    associated_folder: string

    @Column()
    kind: string

    @Column()
    size: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(type => User, user => user.id)
    viewers: User[]

    @OneToMany(type => User, user => user.id)
    collaborators: User[]

    @OneToMany(type => Comment, comment => comment.file)
    comments: Comment[]

    @ManyToOne(type => User, user => user.files)
    owner: User

    @ManyToOne(type => Library, library => library.files)
    library: Library
}
