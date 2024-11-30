import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioDto } from './usuario.dto';
import { BonoService } from '../bono/bono.service';
import { ClaseService } from '../clase/clase.service';
import { plainToInstance } from 'class-transformer';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Long } from 'typeorm';
import { Role } from './role.enum';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    @Inject(forwardRef(() => BonoService))
    private readonly bonoService: BonoService,
    private readonly claseService: ClaseService,
  ) {}

  async create(usuarioDto: UsuarioDto): Promise<UsuarioEntity> {
    // Validaciones para rol
    if (usuarioDto.rol === Role.PROFESOR) {
      if (!['TICS', 'IMAGINE', 'COMIT'].includes(usuarioDto.grupoinvestigacion)) {
        throw new BusinessLogicException(
          'The group is not valid',
          BusinessError.PRECONDITION_FAILED,
        );
      }
    } else {
      if (usuarioDto.extension?.toString().length < 8) {
        throw new BusinessLogicException(
          'The extension is not valid',
          BusinessError.PRECONDITION_FAILED,
        );
      }
    }

    // Validación opcional para bonos
    if (usuarioDto.BonosId) {
      for (const bonoId of usuarioDto.BonosId) {
        const bono = await this.bonoService.findOne(bonoId);
        if (!bono) {
          throw new BusinessLogicException(
            'The bono with the given id was not found',
            BusinessError.NOT_FOUND,
          );
        }
      }
    }

    // Validación opcional para clases
    if (usuarioDto.clasesId) {
      for (const claseId of usuarioDto.clasesId) {
        const clase = await this.claseService.findOne(claseId);
        if (!clase) {
          throw new BusinessLogicException(
            'The clase with the given id was not found',
            BusinessError.NOT_FOUND,
          );
        }
      }
    }

    // Creación del usuario sin requerir asociaciones
    const usuario = plainToInstance(UsuarioEntity, usuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  async findOne(id: Long): Promise<UsuarioEntity> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['bonos', 'clases'],
    });
    if (!usuario) {
      throw new BusinessLogicException(
        'The usuario with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return usuario;
  }

  async delete(id: Long): Promise<void> {
    const usuario = await this.findOne(id);
    if (usuario.bonos?.length > 0 || usuario.rol === Role.DECANA) {
      throw new BusinessLogicException(
        "The usuario can't be deleted",
        BusinessError.PRECONDITION_FAILED,
      );
    }
    await this.usuarioRepository.remove(usuario);
  }
}
