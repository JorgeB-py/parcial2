import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';   
import { ClaseEntity } from './clase.entity';



@Injectable()
export class ClaseService {
    constructor(
        @InjectRepository(ClaseEntity)
        private readonly claseRepository: Repository<ClaseEntity>
    ){}
    async findOne(id: Long): Promise<ClaseEntity> {
        const bono: ClaseEntity = await this.claseRepository.findOne({where: {id}, relations: ["bonos", "usuario"] } );
        if (!bono){
            throw new BusinessLogicException("The clase with the given id was not found", BusinessError.NOT_FOUND);
        }
        return bono;
    }
    async create(bono: ClaseEntity): Promise<ClaseEntity> {
        return await this.claseRepository.save(bono);
    }
 
}
