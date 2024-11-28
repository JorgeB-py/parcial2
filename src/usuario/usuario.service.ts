import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';   
import { UsuarioEntity } from './usuario.entity';



@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ){}
    async findOne(id: Long): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id}, relations: ["bonos", "clases"] } );
        if (!usuario){
            throw new BusinessLogicException("The profesor with the given id was not found", BusinessError.NOT_FOUND);
        }
        return usuario;
    }
    async create(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        return await this.usuarioRepository.save(usuario);
    }

    async delete(id: Long) {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where:{id}});
        if (!usuario)
          throw new BusinessLogicException("The profesor with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.usuarioRepository.remove(usuario);
    }
    async deletebyCedula(cedula: number) {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where:{cedula}});
        if (!usuario)
          throw new BusinessLogicException("The profesor with the given cedula was not found", BusinessError.NOT_FOUND);
     
        await this.usuarioRepository.remove(usuario);
    }
 
}
