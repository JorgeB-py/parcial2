import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { BonoEntity } from './bono.entity';
import { ClaseService } from '../clase/clase.service';
import { UsuarioService } from '../usuario/usuario.service';
import { BonoDto } from './bono.dto';
import { plainToInstance } from 'class-transformer';
import { Role } from '../usuario/role.enum';

@Injectable()
export class BonoService {
  constructor(
    @InjectRepository(BonoEntity)
    private readonly bonoRepository: Repository<BonoEntity>,
    private readonly claseService: ClaseService,
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuarioService: UsuarioService,
  ) {}

  async findAll(): Promise<BonoEntity[]> {
    return await this.bonoRepository.find({ relations: ['clase', 'usuario'] });
  }

  async findOne(id: Long): Promise<BonoEntity> {
    const bono: BonoEntity = await this.bonoRepository.findOne({
      where: { id },
      relations: ['clase', 'usuario'],
    });
    if (!bono) {
      throw new BusinessLogicException(
        'The bono with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return bono;
  }

  async create(bonoDto: BonoDto): Promise<BonoEntity> {
    // Validación opcional para la asociación con la clase
    let clase = null;
    if (bonoDto.claseId) {
      clase = await this.claseService.findOne(bonoDto.claseId);
      if (!clase) {
        throw new BusinessLogicException(
          'The clase with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
    }

    // Validación opcional para la asociación con el usuario
    let usuario = null;
    if (bonoDto.usuarioId) {
      usuario = await this.usuarioService.findOne(bonoDto.usuarioId);
      if (!usuario) {
        throw new BusinessLogicException(
          'The usuario with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
    }

    // Validar el monto y el rol del usuario, pero permitir usuarios nulos
    if (bonoDto.monto === null || bonoDto.monto < 0 || (usuario && usuario.rol !== Role.PROFESOR)) {
      console.log('Rol del usuario:', usuario ? usuario.rol : null);
      console.log('Monto del bono:', bonoDto.monto);
      console.log('Monto menor que 0:', bonoDto.monto < 0);
      throw new BusinessLogicException(
        'The monto is not valid',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);

    return await this.bonoRepository.save(bono);
  }

  async delete(id: Long) {
    const bono: BonoEntity = await this.bonoRepository.findOne({ where: { id } });
    if (!bono) {
      throw new BusinessLogicException(
        'The bono with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    if (bono.calificacion > 4) {
      throw new BusinessLogicException(
        'The bono can´t be deleted',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    await this.bonoRepository.remove(bono);
  }
}
