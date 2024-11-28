import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';   
import { BonoEntity } from './bono.entity';



@Injectable()
export class BonoService {
    constructor(
        @InjectRepository(BonoEntity)
        private readonly bonoRepository: Repository<BonoEntity>
    ){}
    async findAll(): Promise<BonoEntity[]> {
        return await this.bonoRepository.find({ relations: ["clase", "usuario"] });
    }
    async findOne(id: Long): Promise<BonoEntity> {
        const bono: BonoEntity = await this.bonoRepository.findOne({where: {id}, relations: ["clase", "usuario"] } );
        if (!bono){
            throw new BusinessLogicException("The bono with the given id was not found", BusinessError.NOT_FOUND);
        }
        return bono;
    }
    async create(bono: BonoEntity): Promise<BonoEntity> {
        return await this.bonoRepository.save(bono);
    }
    async delete(id: Long) {
        const bono: BonoEntity = await this.bonoRepository.findOne({where:{id}});
        if (!bono)
          throw new BusinessLogicException("The bono with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.bonoRepository.remove(bono);
    }
 
}
