import { forwardRef, Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { ClaseEntity } from '../clase/clase.entity';
import { BonoEntity } from '../bono/bono.entity';
import { ClaseService } from '../clase/clase.service';
import { BonoService } from '../bono/bono.service';

@Module({
  providers: [UsuarioService, ClaseService, BonoService],
  controllers: [UsuarioController],
  imports:[TypeOrmModule.forFeature([UsuarioEntity, ClaseEntity, BonoEntity])],
  exports:[UsuarioService]
})
export class UsuarioModule {}