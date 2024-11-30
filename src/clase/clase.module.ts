import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { ClaseController } from './clase.controller';
import { ClaseEntity } from './clase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from '../bono/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { BonoService } from '../bono/bono.service';
import { UsuarioService } from '../usuario/usuario.service';

@Module({
  providers: [ClaseService, BonoService, UsuarioService],
  controllers: [ClaseController],
  imports:[TypeOrmModule.forFeature([ClaseEntity, BonoEntity, UsuarioEntity])],
  exports:[ClaseService]
})

export class ClaseModule {}
