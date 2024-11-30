import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { Long } from 'typeorm';
import { UsuarioDto } from './usuario.dto';
import { ClaseService } from '../clase/clase.service';
import { UsuarioService } from '../usuario/usuario.service';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { BonoService } from 'src/bono/bono.service';
import { UsuarioEntity } from './usuario.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('usuario')
export class UsuarioController {
    constructor(private readonly bonoService: BonoService,
        private readonly claseService: ClaseService,
        private readonly usuarioService: UsuarioService
        
    ) { }
    @Get(':usuarioId')
    async findOne(@Param('usuarioId') usuarioId: Long) {
        return await this.usuarioService.findOne(usuarioId);
    }

    @Post()
    async create(@Body() usuarioDto: UsuarioDto) {
        return await this.usuarioService.create(usuarioDto);
    }

    @Delete(':usuarioId')
    @HttpCode(204)
    async delete(@Param('usuarioId') usuarioId: Long) {
        return await this.usuarioService.delete(usuarioId);
    }
}
