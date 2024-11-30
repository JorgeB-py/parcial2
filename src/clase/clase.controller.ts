import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { Long } from 'typeorm';
import { ClaseService } from '../clase/clase.service';
import { UsuarioService } from '../usuario/usuario.service';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { BonoService } from '../bono/bono.service';
import { ClaseDto } from './clase.dto';
import { ClaseEntity } from './clase.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('clase')
export class ClaseController {
  constructor(
    private readonly bonoService: BonoService,
    private readonly claseService: ClaseService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Get(':claseId')
  async findOne(@Param('claseId') claseId: Long) {
    return await this.claseService.findOne(claseId);
  }

  @Post()
  async create(@Body() claseDto: ClaseDto) {
    // Validación del código
    if (claseDto.codigo.length != 10) {
      throw new BusinessLogicException('The code is not valid', BusinessError.PRECONDITION_FAILED);
    }

    if (claseDto.usuarioId) {
      const usuario = await this.usuarioService.findOne(claseDto.usuarioId);
      if (!usuario) {
        throw new BusinessLogicException(
          'The usuario with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
    }

    if (claseDto.BonosId && claseDto.BonosId.length > 0) {
      for (const bonoId of claseDto.BonosId) {
        const bono = await this.bonoService.findOne(bonoId);
        if (!bono) {
          throw new BusinessLogicException(
            'The bono with the given id was not found',
            BusinessError.NOT_FOUND,
          );
        }
      }
    }
    const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDto);
    return await this.claseService.create(clase);
  }
}
