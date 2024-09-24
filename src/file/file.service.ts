import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { UserService } from 'src/user/user.service';
import { LibraryService } from 'src/library/library.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FolderService } from 'src/folder/folder.service';
import { Folder } from 'src/folder/entities/folder.entity';
import pdf from 'pdf-parse'
import * as XLSX from 'xlsx';
import { UploadFileDto } from './dto/upload-file.dto';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

@Injectable()
export class FileService {

  constructor(
    @InjectRepository(File)
    readonly fileRepository: Repository<File>,
    readonly userService: UserService,
    readonly libraryService: LibraryService,
    readonly folderService: FolderService
  ){}

  async create(createFileDto: CreateFileDto, file: Express.Multer.File, user: any) {
    try{
      let fileCreator = await this.userService.findOne(user.email)
      let library = await this.libraryService.findOne(createFileDto.associated_library)
      let folder: Folder | null

      if(createFileDto.associated_folder.length > 0) folder = await this.folderService.findOne(createFileDto.associated_folder)

      if(!fileCreator || !library) throw new BadRequestException(`Specified library doesn't exist`)
        
      let fileObj = this.fileRepository.create({
        name: file.originalname,
        owner: fileCreator,
        type: 'markdown',
        associated_folder: folder ? folder.name : '',
        library: library,
        body: file.buffer.toString(),
        viewers: [],
        collaborators: [],
        comments: []
      })

      let {owner, ...newFile} = await this.fileRepository.save(fileObj)
      let createdFile = {
        file: newFile,
        owner: owner.id,
      }

      return createdFile;
    } catch(error) {
      throw new BadRequestException(error)
    }
  }

  async upload(uploadFileDto: UploadFileDto, file: Express.Multer.File, user: any){
    try {
      let fileCreator = await this.userService.findOne(user.email)
      let library = await this.libraryService.findOne(uploadFileDto.associated_library)
      let folder = await this.folderService.findOne(uploadFileDto.associated_folder)
      let fileContent: any;

      switch(file.mimetype){
        case 'aplication/pdf':
          const pdfData = await pdf(file.buffer);
          fileContent = pdfData.text
          break;
        case 'application/json':
          fileContent = JSON.parse(file.buffer.toString());
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          const zip = new PizZip(file.buffer);
          const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
          fileContent = doc.getFullText();
          break;

        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          const workbook = XLSX.read(file.buffer, { type: 'buffer' });
          const sheetNames = workbook.SheetNames;
          const firstSheet = workbook.Sheets[sheetNames[0]];
          fileContent = XLSX.utils.sheet_to_json(firstSheet);
        default: 
          fileContent = file.buffer.toString()
      }
  
      if(!fileCreator || !library || !folder) throw new BadRequestException(`Specified library doesn't exist`)

      let fileObj = this.fileRepository.create({
        name: file.originalname,
        owner: fileCreator,
        type: file.mimetype,
        associated_folder: folder ? folder.id : '',
        library: library,
        kind: uploadFileDto.kind,
        size: file.size,
        body: file.buffer.toString(),
        viewers: [],
        collaborators: [],
        comments: []
      })

      await this.fileRepository.save(fileObj)
      let files = this.findAll(user.email)

      return files
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(user: any) {
    try{
      let files = await this.fileRepository.find({
        where: {owner: {email_address: user.email}},
        relations: ['library', 'owner'],
        order: {updatedAt: 'asc'}
      })

      return files
    } catch(error) {
      console.log(error)
      throw new BadRequestException("Error while retrieving files: ", error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
