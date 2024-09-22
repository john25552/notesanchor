import { Library } from "src/library/entities/library.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Folder {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column()
    name: string

    @ManyToOne(type => Library, library => library.folders)
    associated_library: Library
}
